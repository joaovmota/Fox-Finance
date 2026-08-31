import {
  calcAvailableCents,
  calcCurrentInvoiceCents,
  calcUsagePercent,
} from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";

export function CardSummary({ card, now = new Date() }) {
  const available = calcAvailableCents(card);
  const invoice = calcCurrentInvoiceCents(card, now);
  const usage = calcUsagePercent(card);
  return (
    <section className="fox-card cards-summary" data-testid="card-summary">
      <div className="cards-summary-top">
        <div>
          <span className="fox-muted">Disponível</span>
          <strong className="cards-summary-available">{formatBRL(available)}</strong>
        </div>
        <div className="cards-summary-invoice">
          <span className="fox-muted">Fatura atual</span>
          <strong>{formatBRL(invoice)}</strong>
        </div>
      </div>
      <div
        className="cards-summary-progress"
        role="progressbar"
        aria-valuenow={usage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${usage}%` }} />
      </div>
      <div className="cards-summary-meta">
        <span className="fox-muted">{usage}% utilizado</span>
        <span className="fox-muted">Limite total: {formatBRL(card.limitTotal)}</span>
      </div>
    </section>
  );
}
