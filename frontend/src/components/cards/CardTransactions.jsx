import {
  CircleDollarSign,
  UtensilsCrossed,
  CarFront,
  Pill,
  ShoppingBag,
  Plane,
  Repeat2,
  Zap,
} from "lucide-react";
import { Card, EmptyState } from "@/components/ui/fox";
import { nextInstallmentInfo } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";

const CATEGORY_ICONS = {
  food: { Icon: UtensilsCrossed, tone: "food" },
  transport: { Icon: CarFront, tone: "transport" },
  health: { Icon: Pill, tone: "health" },
  shopping: { Icon: ShoppingBag, tone: "shopping" },
  travel: { Icon: Plane, tone: "travel" },
  subscription: { Icon: Repeat2, tone: "subscription" },
  utility: { Icon: Zap, tone: "utility" },
};

function TransactionIcon({ category }) {
  const { Icon, tone } = CATEGORY_ICONS[category] || { Icon: CircleDollarSign, tone: "default" };
  return (
    <span className={`card-tx-icon card-tx-icon-${tone}`} aria-hidden="true">
      <Icon size={18} strokeWidth={2} />
    </span>
  );
}

export function CardTransactions({ card }) {
  if (!card.transactions.length) {
    return (
      <Card className="cards-tx-empty">
        <EmptyState
          title="Nenhum lançamento neste cartão"
          description="Assim que você registrar uma compra, ela aparecerá aqui."
        />
      </Card>
    );
  }
  return (
    <section className="cards-tx-section" data-testid="card-transactions">
      <h2 className="cards-tx-title">
        LANÇAMENTOS — <span>{card.apelido.toUpperCase()}</span>
      </h2>
      <Card className="cards-tx-list">
        {card.transactions.map((tx) => {
          const installment = nextInstallmentInfo(tx);
          const displayCents = installment ? installment.amountCents : tx.amount;
          return (
            <article
              key={tx.id}
              className="card-tx-item"
              data-testid={`card-tx-${tx.id}`}
            >
              <TransactionIcon category={tx.category} />
              <div className="card-tx-copy">
                <strong>{tx.merchant}</strong>
                <span>
                  {tx.dateLabel}
                  {installment && (
                    <>
                      {" · "}
                      <em>
                        Parcela {installment.current}/{installment.total}
                      </em>
                    </>
                  )}
                </span>
              </div>
              <strong className="card-tx-value">−{formatBRL(displayCents)}</strong>
            </article>
          );
        })}
      </Card>
    </section>
  );
}
