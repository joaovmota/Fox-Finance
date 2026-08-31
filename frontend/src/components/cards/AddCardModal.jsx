import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { Button, Modal } from "@/components/ui/fox";
import { BankAutocomplete } from "@/components/ui/BankAutocomplete";
import { getBankTheme, identifyBank } from "@/lib/cardsLogic";
import { toCents } from "@/lib/money";

const initialForm = {
  apelido: "",
  bank: "",
  lastFour: "",
  limitTotal: "",
  closingDay: "3",
  dueDay: "10",
};

function maskDigits(value, max) {
  return String(value).replace(/\D/g, "").slice(0, max);
}
function maskCurrency(value) {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
// Capitaliza a primeira letra de cada palavra sem tocar no restante,
// preservando dígitos e caracteres já digitados pelo usuário.
export function capitalizeWords(text) {
  return String(text).replace(/(^|\s+)([\p{L}])/gu, (_, ws, ch) => `${ws}${ch.toLocaleUpperCase("pt-BR")}`);
}

export function AddCardModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const brandKey = useMemo(() => identifyBank(form.bank), [form.bank]);
  const theme = getBankTheme(brandKey);
  const disabled =
    !form.apelido.trim() ||
    !form.bank.trim() ||
    form.lastFour.length !== 4 ||
    !form.limitTotal ||
    !form.closingDay ||
    !form.dueDay;

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    onSubmit({
      apelido: form.apelido.trim(),
      bank: form.bank.trim(),
      lastFour: form.lastFour,
      brandKey,
      limitTotal: toCents(form.limitTotal),
      closingDay: Number(form.closingDay),
      dueDay: Number(form.dueDay),
      transactions: [],
    });
  };

  return (
    <Modal
      title="Novo cartão"
      onClose={onClose}
      testId="add-card-modal"
      titleId="add-card-title"
    >
      <form className="add-card-form" onSubmit={handleSubmit}>
        <div
          className="add-card-preview"
          style={{ background: theme.background, color: theme.text }}
          data-testid="add-card-preview"
        >
          <div>
            <span style={{ color: theme.softText }}>BANCO</span>
            <strong>{form.bank || "Nome do banco"}</strong>
          </div>
          <span
            className="credit-card-chip"
            style={{ background: "rgba(255,255,255,0.16)" }}
          >
            <CreditCard size={18} strokeWidth={2.2} />
          </span>
          <div className="add-card-preview-number">
            •••• •••• •••• {form.lastFour.padStart(4, "•").slice(-4) || "••••"}
          </div>
        </div>

        <label className="fox-entry-field">
          Apelido do cartão
          <input
            value={form.apelido}
            onChange={(event) => update({ apelido: capitalizeWords(event.target.value) })}
            placeholder="Ex.: Nubank Roxinho, Cartão da Esposa"
            data-testid="new-card-apelido-input"
            required
          />
        </label>

        <div className="fox-entry-field">
          Banco emissor
          <BankAutocomplete
            value={form.bank}
            onChange={(nextValue) => update({ bank: capitalizeWords(nextValue) })}
            testId="new-card-bank"
            required
          />
        </div>

        <div className="fox-entry-two-columns">
          <label className="fox-entry-field">
            Últimos 4 dígitos
            <input
              value={form.lastFour}
              onChange={(event) => update({ lastFour: maskDigits(event.target.value, 4) })}
              inputMode="numeric"
              placeholder="0000"
              data-testid="new-card-lastfour-input"
              required
            />
          </label>
          <label className="fox-entry-field">
            Limite total
            <input
              value={form.limitTotal}
              onChange={(event) => update({ limitTotal: maskCurrency(event.target.value) })}
              inputMode="numeric"
              placeholder="0,00"
              data-testid="new-card-limit-input"
              required
            />
          </label>
        </div>

        <div className="fox-entry-two-columns">
          <label className="fox-entry-field">
            Dia de fechamento
            <input
              value={form.closingDay}
              onChange={(event) => update({ closingDay: maskDigits(event.target.value, 2) })}
              inputMode="numeric"
              placeholder="3"
              data-testid="new-card-closing-input"
              required
            />
          </label>
          <label className="fox-entry-field">
            Dia de vencimento
            <input
              value={form.dueDay}
              onChange={(event) => update({ dueDay: maskDigits(event.target.value, 2) })}
              inputMode="numeric"
              placeholder="10"
              data-testid="new-card-due-input"
              required
            />
          </label>
        </div>

        <Button type="submit" disabled={disabled} data-testid="save-card-button">
          <CreditCard size={16} />
          Adicionar cartão
        </Button>
      </form>
    </Modal>
  );
}
