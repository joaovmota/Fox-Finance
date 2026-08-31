// Business logic for the Cards module. Pure functions, no side effects.
// Money is treated as integer cents to avoid float drift.

export const bankThemes = {
  nubank: {
    label: "Nubank",
    background: "linear-gradient(135deg, #8A05BE 0%, #6D0AA0 100%)",
    text: "#ffffff",
    solid: "#820AD1",
    softText: "rgba(255,255,255,0.72)",
    progressTrack: "rgba(255,255,255,0.18)",
    progressFill: "#ffffff",
  },
  inter: {
    label: "Banco Inter",
    background: "linear-gradient(135deg, #FF8A2B 0%, #E15A00 100%)",
    text: "#ffffff",
    solid: "#FF7A00",
    softText: "rgba(255,255,255,0.78)",
    progressTrack: "rgba(255,255,255,0.22)",
    progressFill: "#ffffff",
  },
  bb: {
    label: "Banco do Brasil",
    background: "linear-gradient(135deg, #FFDF00 0%, #E8C500 100%)",
    text: "#0d2a5c",
    solid: "#FFDF00",
    softText: "rgba(13,42,92,0.72)",
    progressTrack: "rgba(13,42,92,0.18)",
    progressFill: "#0d2a5c",
  },
  xp: {
    label: "XP Investimentos",
    background: "linear-gradient(135deg, #202b52 0%, #0d1735 100%)",
    text: "#ffffff",
    solid: "#0F1B3D",
    softText: "rgba(255,255,255,0.7)",
    progressTrack: "rgba(255,255,255,0.14)",
    progressFill: "#ffffff",
  },
  c6: {
    label: "C6 Bank",
    background: "linear-gradient(135deg, #303030 0%, #050505 100%)",
    text: "#ffffff",
    solid: "#000000",
    softText: "rgba(255,255,255,0.66)",
    progressTrack: "rgba(255,255,255,0.16)",
    progressFill: "#ffffff",
  },
  itau: {
    label: "Itaú",
    background: "linear-gradient(135deg, #EC7000 0%, #003399 100%)",
    text: "#ffffff",
    solid: "#EC7000",
    softText: "rgba(255,255,255,0.72)",
    progressTrack: "rgba(255,255,255,0.2)",
    progressFill: "#ffffff",
  },
  santander: {
    label: "Santander",
    background: "linear-gradient(135deg, #EC0000 0%, #900000 100%)",
    text: "#ffffff",
    solid: "#EC0000",
    softText: "rgba(255,255,255,0.72)",
    progressTrack: "rgba(255,255,255,0.2)",
    progressFill: "#ffffff",
  },
  bradesco: {
    label: "Bradesco",
    background: "linear-gradient(135deg, #CC092F 0%, #7A0518 100%)",
    text: "#ffffff",
    solid: "#CC092F",
    softText: "rgba(255,255,255,0.72)",
    progressTrack: "rgba(255,255,255,0.2)",
    progressFill: "#ffffff",
  },
  caixa: {
    label: "Caixa",
    background: "linear-gradient(135deg, #005CA9 0%, #003060 100%)",
    text: "#ffffff",
    solid: "#005CA9",
    softText: "rgba(255,255,255,0.72)",
    progressTrack: "rgba(255,255,255,0.2)",
    progressFill: "#ffffff",
  },
  generic: {
    label: "Cartão",
    background: "linear-gradient(135deg, #1c3f42 0%, #0a1e20 100%)",
    text: "#ffffff",
    solid: "#173638",
    softText: "rgba(255,255,255,0.68)",
    progressTrack: "rgba(255,255,255,0.16)",
    progressFill: "#50e3c2",
  },
};

const BANK_PATTERNS = [
  { key: "nubank", tests: [/\bnu\b/i, /nubank/i] },
  { key: "inter", tests: [/inter/i] },
  { key: "bb", tests: [/banco do brasil/i, /\bbb\b/i] },
  { key: "xp", tests: [/xp/i, /rico/i] },
  { key: "c6", tests: [/c6/i] },
  { key: "itau", tests: [/ita[uú]/i] },
  { key: "santander", tests: [/santander/i] },
  { key: "bradesco", tests: [/bradesco/i] },
  { key: "caixa", tests: [/caixa/i] },
];

export function identifyBank(input = "") {
  const value = String(input).trim();
  if (!value) return "generic";
  for (const bank of BANK_PATTERNS) {
    if (bank.tests.some((pattern) => pattern.test(value))) return bank.key;
  }
  return "generic";
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
