import { BellRing, ChevronRight } from "lucide-react";
import { collectDueAlerts } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";
import { calcCurrentInvoiceCents } from "@/lib/cardsLogic";

export function DueAlert({ cards, activeId, onFocus, now = new Date() }) {
  const alerts = collectDueAlerts(cards, now);
  if (alerts.length === 0) return null;

  return (
    <section className="due-alert" role="alert" data-testid="due-alert">
      <span className="due-alert-icon" aria-hidden="true">
        <BellRing size={18} strokeWidth={2} />
      </span>
      <div className="due-alert-copy">
        <strong>
          {alerts.length === 1
            ? "1 fatura vence em breve"
            : `${alerts.length} faturas vencem em breve`}
        </strong>
        <ul>
          {alerts.map(({ card, proximity }) => {
            const invoice = calcCurrentInvoiceCents(card, now);
            const isActive = card.id === activeId;
            return (
              <li key={card.id}>
                <button
                  type="button"
                  className={`due-alert-row ${isActive ? "is-active" : ""}`}
                  onClick={() => onFocus(card.id)}
                  data-testid={`due-alert-card-${card.id}`}
                >
                  <span className="due-alert-bank">{card.apelido}</span>
                  <span className="due-alert-info">
                    {formatBRL(invoice)} · {proximity.label}
                  </span>
                  <ChevronRight size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
