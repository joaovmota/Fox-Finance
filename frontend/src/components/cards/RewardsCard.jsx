import { Award, ChevronRight, Gift, Sparkles } from "lucide-react";
import { calcRewardsAccrual, formatRewardsValue } from "@/lib/cardsLogic";

const REWARDS_META = {
  cashback: { Icon: Gift, tone: "cashback", copy: "Cashback do ciclo" },
  points: { Icon: Sparkles, tone: "points", copy: "Pontos ganhos no ciclo" },
  miles: { Icon: Award, tone: "miles", copy: "Milhas do ciclo" },
};

export function RewardsCard({ card, onToggle }) {
  if (!card.rewards) return null;
  const meta = REWARDS_META[card.rewards.type] || REWARDS_META.points;
  const accrual = calcRewardsAccrual(card);
  const totalBalance = card.rewards.enabled ? card.rewards.balance + accrual : card.rewards.balance;
  const Icon = meta.Icon;

  return (
    <section
      className={`fox-card rewards-card rewards-${meta.tone} ${
        card.rewards.enabled ? "is-active" : "is-muted"
      }`}
      data-testid="rewards-card"
    >
      <span className={`rewards-icon rewards-icon-${meta.tone}`}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="rewards-copy">
        <span className="fox-muted">{card.rewards.label}</span>
        <strong className="rewards-balance">
          {card.rewards.enabled ? formatRewardsValue(card, totalBalance) : "Desligado"}
        </strong>
        <span className="rewards-detail">
          {card.rewards.enabled
            ? `${meta.copy}: +${formatRewardsValue(card, accrual)}`
            : "Ative para começar a acumular"}
        </span>
      </div>
      <button
        type="button"
        className="rewards-toggle"
        onClick={onToggle}
        data-testid="rewards-toggle"
        aria-label={card.rewards.enabled ? "Desativar programa" : "Ativar programa"}
      >
        {card.rewards.enabled ? "Gerenciar" : "Ativar"}
        <ChevronRight size={14} />
      </button>
    </section>
  );
}
