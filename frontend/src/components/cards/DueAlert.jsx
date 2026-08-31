import { useState } from "react";
import { BellRing, ChevronDown, ChevronUp } from "lucide-react";
import { collectDueAlerts } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";
import { calcCurrentInvoiceCents } from "@/lib/cardsLogic";

export function DueAlert({ cards, activeId, onFocus, now = new Date() }) {
  const [expanded, setExpanded] = useState(false);
  const alerts = collectDueAlerts(cards, now);
  if (alerts.length === 0) return null;

  const total = alerts.reduce(
    (sum, { card }) => sum + calcCurrentInvoiceCents(card, now),
    0,
  );

  const summary =
    alerts.length === 1 ? "1 fatura vence em breve" : `${alerts.length} faturas vencem em breve`;

  return (
    <section
      className={`due-alert ${expanded ? "is-expanded" : "is-collapsed"}`}
      role="alert"
      data-testid="due-alert"
    >
      <button
        type="button"
        className="due-alert-toggle"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls="due-alert-body"
        data-testid="due-alert-toggle"
      >
        <span className="due-alert-icon" aria-hidden="true">
          <BellRing size={18} strokeWidth={2} />
        </span>
        <div className="due-alert-headline">
          <strong>{summary}</strong>
          <span className="due-alert-hint">
            {expanded ? "Toque para recolher" : "Toque para ver o valor exato"}
          </span>
        </div>
        <span className="due-alert-caret" aria-hidden="true">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div className="due-alert-body" id="due-alert-body">
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
                    <span className="due-alert-invoice" data-testid={`due-alert-value-${card.id}`}>
                      {formatBRL(invoice)}
                    </span>
                    <span className="due-alert-proximity">{proximity.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {alerts.length > 1 && (
            <div className="due-alert-total">
              <span>Total imediato</span>
              <strong>{formatBRL(total)}</strong>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
