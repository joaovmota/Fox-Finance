// Business logic for the Cards module. Pure functions, no side effects.
// Money is treated as integer cents to avoid float drift.

import { banks, GENERIC_BANK, findBank } from "@/lib/banks";

/**
 * Convert a hex/rgb color to `rgba()` with the given alpha, so we can derive
 * translucent progress tracks and softened text tones out of `corTexto`.
 */
function withAlpha(color, alpha) {
  if (!color) return `rgba(255,255,255,${alpha})`;
  const trimmed = color.trim();
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    const normalized = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const num = parseInt(normalized, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return trimmed;
}

/**
 * Convert a bank entry (`{ cor, corTexto, ... }`) into the theme object the
 * card visuals consume. A single source of truth: change `banks.js` and every
 * card automatically follows.
 */
function themeFromBank(bank) {
  return {
    id: bank.id,
    label: bank.nome,
    solid: bank.cor,
    background: `linear-gradient(135deg, ${bank.cor} 0%, color-mix(in srgb, ${bank.cor} 78%, black) 100%)`,
    text: bank.corTexto,
    softText: withAlpha(bank.corTexto, 0.72),
    progressTrack: withAlpha(bank.corTexto, 0.18),
    progressFill: bank.corTexto,
  };
}

// Keep the bankThemes export so existing callers (RewardsCard tone, tests, etc.)
// continue to resolve without changes. Derived once from the JSON catalogue.
export const bankThemes = Object.fromEntries([
  ...banks.map((bank) => [bank.id, themeFromBank(bank)]),
  ["generic", themeFromBank(GENERIC_BANK)],
]);

export function identifyBank(input = "") {
  const match = findBank(input);
  return match ? match.id : "generic";
}

export function getBankTheme(brandKey) {
  return bankThemes[brandKey] || bankThemes.generic;
}

// -------- Money math (integer cents) --------

function installmentAmountCents(tx) {
  // Distribute total across installments, rounding to nearest cent.
  return Math.round(tx.amount / tx.installmentsTotal);
}

export function calcCommittedCents(card) {
  return card.transactions.reduce((sum, tx) => {
    const remaining = Math.max(0, tx.installmentsTotal - tx.installmentsPaid);
    return sum + installmentAmountCents(tx) * remaining;
  }, 0);
}

export function calcAvailableCents(card) {
  return Math.max(0, card.limitTotal - calcCommittedCents(card));
}

export function calcCurrentInvoiceCents(card, now = new Date()) {
  const invoices = buildInvoices(card, now);
  const open = invoices.find((invoice) => invoice.status === "open");
  return open ? open.totalCents : 0;
}

export function calcUsagePercent(card) {
  if (!card.limitTotal) return 0;
  return Math.min(100, Math.round((calcCommittedCents(card) / card.limitTotal) * 100));
}

// -------- Dates --------

export function getDayProximity(day, now = new Date()) {
  if (!day) return { label: "", tone: "muted", diff: null };
  const current = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let diff;
  if (day >= current) diff = day - current;
  else diff = daysInMonth - current + day;
  if (diff === 0) return { label: "hoje", tone: "urgent", diff };
  if (diff === 1) return { label: "amanhã", tone: "warning", diff };
  if (diff <= 5) return { label: `em ${diff} dias`, tone: "warning", diff };
  return { label: `em ${diff} dias`, tone: "muted", diff };
}

// -------- Transactions helpers --------

export function nextInstallmentInfo(tx) {
  if (tx.installmentsTotal <= 1) return null;
  const next = tx.installmentsPaid + 1;
  return { current: next, total: tx.installmentsTotal, amountCents: installmentAmountCents(tx) };
}

export function formatMaskedNumber(lastFour = "0000") {
  return `•••• •••• •••• ${String(lastFour).padStart(4, "0").slice(-4)}`;
}

// -------- Invoice cycles --------

const MONTH_LABELS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

function addMonths(year, month, delta) {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: total % 12 };
}

function cycleKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function cycleLabel(year, month) {
  return `${MONTH_LABELS[month]}/${year}`;
}

// Purchase cycle: if purchase date > closingDay, invoice closes the following month.
function purchaseCycle(dateISO, closingDay) {
  const date = new Date(`${dateISO}T00:00:00`);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return day > closingDay ? addMonths(year, month, 1) : { year, month };
}

// Current cycle: cycle whose closing date is the next closingDay from `now`.
function currentCycle(now, closingDay) {
  const current = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  return current > closingDay ? addMonths(year, month, 1) : { year, month };
}

function statusFor(cycle, current) {
  const cy = cycle.year * 12 + cycle.month;
  const cur = current.year * 12 + current.month;
  if (cy < cur) return "paid";
  if (cy === cur) return "open";
  return "future";
}

/**
 * Build the list of invoices grouped by billing cycle. Includes all pending
 * installments (installmentsPaid+1 .. installmentsTotal) and marks past cycles
 * as "paid" so the user can browse the history.
 */
export function buildInvoices(card, now = new Date()) {
  const buckets = new Map();
  const current = currentCycle(now, card.closingDay);

  for (const tx of card.transactions) {
    const first = purchaseCycle(tx.dateISO, card.closingDay);
    const perInstallment = Math.round(tx.amount / tx.installmentsTotal);
    for (let k = 0; k < tx.installmentsTotal; k += 1) {
      const cycle = addMonths(first.year, first.month, k);
      const key = cycleKey(cycle.year, cycle.month);
      if (!buckets.has(key)) {
        buckets.set(key, {
          key,
          label: cycleLabel(cycle.year, cycle.month),
          year: cycle.year,
          month: cycle.month,
          totalCents: 0,
          items: [],
        });
      }
      const bucket = buckets.get(key);
      const isPaid = k < tx.installmentsPaid;
      bucket.totalCents += perInstallment;
      bucket.items.push({
        id: `${tx.id}-${k + 1}`,
        merchant: tx.merchant,
        category: tx.category,
        dateLabel: tx.dateLabel,
        amountCents: perInstallment,
        installmentCurrent: k + 1,
        installmentTotal: tx.installmentsTotal,
        paid: isPaid,
      });
    }
  }

  return Array.from(buckets.values())
    .map((bucket) => ({ ...bucket, status: statusFor(bucket, current) }))
    .sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));
}

// -------- Rewards --------

export function calcRewardsAccrual(card) {
  if (!card.rewards?.enabled) return 0;
  const spentCents = card.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const spentReais = spentCents / 100;
  if (card.rewards.type === "cashback") {
    // rate is a percentage — result in cents to stay consistent with money.js
    return Math.round((spentCents * card.rewards.rate) / 100);
  }
  // points / miles — floor of rate * reais
  return Math.floor(spentReais * card.rewards.rate);
}

export function formatRewardsValue(card, amount) {
  if (!card.rewards) return "";
  if (card.rewards.type === "cashback") {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount / 100);
  }
  return `${new Intl.NumberFormat("pt-BR").format(amount)} ${card.rewards.unit}`;
}

// -------- Due alerts --------

export function collectDueAlerts(cards, now = new Date(), thresholdDays = 3) {
  return cards
    .map((card) => ({ card, proximity: getDayProximity(card.dueDay, now) }))
    .filter(({ proximity }) => proximity.diff !== null && proximity.diff <= thresholdDays);
}

// -------- Category breakdown --------

export const CATEGORY_META = {
  food: { label: "Alimentação", tone: "food", color: "#ff6b96" },
  transport: { label: "Transporte", tone: "transport", color: "#65c7ff" },
  health: { label: "Saúde", tone: "health", color: "#f6c96d" },
  shopping: { label: "Compras", tone: "shopping", color: "#c5a4ff" },
  travel: { label: "Viagem", tone: "travel", color: "#50e3c2" },
  subscription: { label: "Assinaturas", tone: "subscription", color: "#8fe18c" },
  utility: { label: "Utilidades", tone: "utility", color: "#f6c96d" },
};

export function getCategoryMeta(key) {
  return CATEGORY_META[key] || { label: key || "Outros", tone: "default", color: "#8ea9a5" };
}

/**
 * Retorna um resumo de gastos por categoria do cartão. Ordena por total
 * decrescente e devolve `percent` (0-100) relativo ao total gasto no cartão.
 */
export function calcCategoryBreakdown(card) {
  const totals = new Map();
  let sum = 0;
  for (const tx of card.transactions) {
    totals.set(tx.category, (totals.get(tx.category) || 0) + tx.amount);
    sum += tx.amount;
  }
  return Array.from(totals.entries())
    .map(([category, cents]) => ({
      category,
      cents,
      percent: sum ? Math.round((cents / sum) * 100) : 0,
    }))
    .sort((a, b) => b.cents - a.cents);
}
