import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "@/components/ui/fox";
import { buildInvoices } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";

const STATUS_META = {
  paid: { label: "Paga", tone: "paid" },
  open: { label: "Aberta · atual", tone: "open" },
  future: { label: "Futura", tone: "future" },
};

function InvoiceRow({ invoice, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = STATUS_META[invoice.status];
  return (
    <article
      className={`invoice-row invoice-${invoice.status}`}
      data-testid={`invoice-${invoice.key}`}
    >
      <button
        type="button"
        className="invoice-row-head"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`invoice-body-${invoice.key}`}
      >
        <div className="invoice-row-title">
          <strong>{invoice.label}</strong>
          <span className={`invoice-status invoice-status-${meta.tone}`}>{meta.label}</span>
        </div>
        <div className="invoice-row-total">
          <strong>{formatBRL(invoice.totalCents)}</strong>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <ul className="invoice-items" id={`invoice-body-${invoice.key}`}>
          {invoice.items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.merchant}</strong>
                <span>
                  {item.dateLabel}
                  {item.installmentTotal > 1 && (
                    <>
                      {" · "}
                      <em>
                        Parcela {item.installmentCurrent}/{item.installmentTotal}
                      </em>
                    </>
                  )}
                  {item.paid && <span className="invoice-item-paid"> · paga</span>}
                </span>
              </div>
              <strong className="invoice-item-value">−{formatBRL(item.amountCents)}</strong>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function InvoiceDetailModal({ card, onClose, now = new Date() }) {
  const invoices = buildInvoices(card, now);
  const total = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const openInvoice = invoices.find((invoice) => invoice.status === "open");

  return (
    <Modal
      title={`Faturas · ${card.apelido}`}
      onClose={onClose}
      testId="invoice-detail-modal"
      titleId="invoice-detail-title"
    >
      <div className="invoice-summary">
        <div>
          <span className="fox-muted">Total em aberto + futuro</span>
          <strong>{formatBRL(total)}</strong>
        </div>
        <div>
          <span className="fox-muted">Fatura atual</span>
          <strong className="invoice-summary-open">
            {openInvoice ? formatBRL(openInvoice.totalCents) : formatBRL(0)}
          </strong>
        </div>
      </div>
      <div className="invoice-list" data-testid="invoice-list">
        {invoices.length === 0 ? (
          <p className="fox-muted invoice-empty">Nenhuma fatura registrada.</p>
        ) : (
          invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.key}
              invoice={invoice}
              defaultOpen={invoice.status === "open"}
            />
          ))
        )}
      </div>
    </Modal>
  );
}
