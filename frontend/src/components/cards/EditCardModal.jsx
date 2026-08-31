import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button, Modal } from "@/components/ui/fox";
import { BankAutocomplete } from "@/components/ui/BankAutocomplete";
import { capitalizeWords } from "@/components/cards/AddCardModal";
import { getBankTheme, identifyBank } from "@/lib/cardsLogic";
import { formatBRL, toCents } from "@/lib/money";

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

export function EditCardModal({ card, onClose, onSubmit }) {
  const [form, setForm] = useState({
    apelido: card.apelido,
    bank: card.bank,
    lastFour: card.lastFour,
    limitTotal: (card.limitTotal / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    closingDay: String(card.closingDay),
    dueDay: String(card.dueDay),
  });

  useEffect(() => {
    setForm({
      apelido: card.apelido,
      bank: card.bank,
      lastFour: card.lastFour,
      limitTotal: (card.limitTotal / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      closingDay: String(card.closingDay),
      dueDay: String(card.dueDay),
    });
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const brandKey = useMemo(() => identifyBank(form.bank), [form.bank]);
  const theme = getBankTheme(brandKey);
  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const disabled =
    !form.apelido.trim() ||
    !form.bank.trim() ||
    form.lastFour.length !== 4 ||
    !form.limitTotal ||
    !form.closingDay ||
    !form.dueDay;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    onSubmit({
      ...card,
      apelido: form.apelido.trim(),
      bank: form.bank.trim(),
      lastFour: form.lastFour,
      brandKey,
      limitTotal: toCents(form.limitTotal),
      closingDay: Number(form.closingDay),
      dueDay: Number(form.dueDay),
    });
  };

  return (
    <Modal
      title="Editar cartão"
      onClose={onClose}
      testId="edit-card-modal"
      titleId="edit-card-title"
    >
      <form className="add-card-form" onSubmit={handleSubmit}>
        <div
          className="add-card-preview"
          style={{ background: theme.background, color: theme.text }}
          data-testid="edit-card-preview"
        >
          <div>
            <span style={{ color: theme.softText }}>BANCO</span>
            <strong>{form.bank || "Nome do banco"}</strong>
          </div>
          <div className="add-card-preview-limit">
            <span style={{ color: theme.softText }}>LIMITE</span>
            <strong>{form.limitTotal ? `R$ ${form.limitTotal}` : "R$ 0,00"}</strong>
          </div>
          <div className="add-card-preview-number">
            •••• •••• •••• {form.lastFour.padStart(4, "•").slice(-4) || "••••"}
          </div>
        </div>

        <label className="fox-entry-field">
          Apelido
          <input
            value={form.apelido}
            onChange={(event) => update({ apelido: capitalizeWords(event.target.value) })}
            data-testid="edit-card-apelido-input"
            required
          />
        </label>

        <div className="fox-entry-field">
          Banco emissor
          <BankAutocomplete
            value={form.bank}
            onChange={(nextValue) => update({ bank: capitalizeWords(nextValue) })}
            testId="edit-card-bank"
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
              data-testid="edit-card-lastfour-input"
              required
            />
          </label>
          <label className="fox-entry-field">
            Limite total
            <input
              value={form.limitTotal}
              onChange={(event) => update({ limitTotal: maskCurrency(event.target.value) })}
              inputMode="numeric"
              data-testid="edit-card-limit-input"
              required
            />
          </label>
        </div>

        <div className="fox-entry-two-columns">
          <label className="fox-entry-field">
            Fechamento
            <input
              value={form.closingDay}
              onChange={(event) => update({ closingDay: maskDigits(event.target.value, 2) })}
              inputMode="numeric"
              data-testid="edit-card-closing-input"
              required
            />
          </label>
          <label className="fox-entry-field">
            Vencimento
            <input
              value={form.dueDay}
              onChange={(event) => update({ dueDay: maskDigits(event.target.value, 2) })}
              inputMode="numeric"
              data-testid="edit-card-due-input"
              required
            />
          </label>
        </div>

        <span className="fox-muted edit-card-hint">
          Atual: {formatBRL(card.limitTotal)} · fechamento dia {card.closingDay} · vencimento dia {card.dueDay}
        </span>

        <Button type="submit" disabled={disabled} data-testid="save-edit-card-button">
          <Save size={16} />
          Salvar alterações
        </Button>
      </form>
    </Modal>
  );
}
