import { getDayProximity } from "@/lib/cardsLogic";

function DateBlock({ label, day, testId, now }) {
  const proximity = getDayProximity(day, now);
  return (
    <div className="fox-card cards-date-block" data-testid={testId}>
      <span className="fox-muted">{label}</span>
      <strong>Dia {day}</strong>
      <span className={`cards-date-badge cards-date-badge-${proximity.tone}`}>
        {proximity.label}
      </span>
    </div>
  );
}

export function CardDates({ card, now = new Date() }) {
  return (
    <section className="cards-dates" data-testid="card-dates">
      <DateBlock label="Fechamento" day={card.closingDay} testId="card-closing-date" now={now} />
      <DateBlock label="Vencimento" day={card.dueDay} testId="card-due-date" now={now} />
    </section>
  );
}
