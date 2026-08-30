import { useEffect, useRef } from "react";
import { CreditCard } from "lucide-react";
import { calcUsagePercent, formatMaskedNumber, getBankTheme } from "@/lib/cardsLogic";
import { calcCurrentInvoiceCents } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";

export function CardCarousel({ cards, activeId, onActiveChange }) {
  const scrollerRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = visible.target.getAttribute("data-card-id");
          if (id && id !== activeId) onActiveChange(id);
        }
      },
      { root: scroller, threshold: [0.55, 0.75, 0.95] },
    );
    Object.values(itemRefs.current).forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  return (
    <div className="cards-carousel" data-testid="cards-carousel" ref={scrollerRef}>
      {cards.map((card) => {
        const theme = getBankTheme(card.brandKey);
        const usage = calcUsagePercent(card);
        const invoiceCents = calcCurrentInvoiceCents(card);
        return (
          <article
            key={card.id}
            data-card-id={card.id}
            ref={(node) => (itemRefs.current[card.id] = node)}
            className={`credit-card ${activeId === card.id ? "is-active" : ""}`}
            style={{ background: theme.background, color: theme.text }}
            data-testid={`credit-card-${card.id}`}
            role="button"
            tabIndex={0}
            onClick={() => onActiveChange(card.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onActiveChange(card.id);
              }
            }}
          >
            <header className="credit-card-head">
              <div>
                <span className="credit-card-eyebrow" style={{ color: theme.softText }}>
                  BANCO
                </span>
                <strong className="credit-card-bank">{card.bank}</strong>
              </div>
              <span className="credit-card-chip" style={{ background: "rgba(255,255,255,0.16)" }}>
                <CreditCard size={18} strokeWidth={2.2} />
              </span>
            </header>

            <div className="credit-card-number" aria-label={`Cartão terminado em ${card.lastFour}`}>
              {formatMaskedNumber(card.lastFour)}
            </div>

            <footer className="credit-card-foot">
              <div>
                <span style={{ color: theme.softText }}>FATURA</span>
                <strong>{formatBRL(invoiceCents)}</strong>
              </div>
              <div className="credit-card-due">
                <span style={{ color: theme.softText }}>VENCIMENTO</span>
                <strong>Dia {card.dueDay}</strong>
              </div>
            </footer>

            <div
              className="credit-card-progress"
              style={{ background: theme.progressTrack }}
              role="progressbar"
              aria-valuenow={usage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uso do limite: ${usage}%`}
            >
              <span style={{ width: `${usage}%`, background: theme.progressFill }} />
            </div>

            <div className="credit-card-meta">
              <span style={{ color: theme.softText }}>{usage}% usado</span>
              <span style={{ color: theme.softText }}>limite {formatBRL(card.limitTotal)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
