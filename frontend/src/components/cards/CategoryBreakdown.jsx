import {
  CarFront,
  CircleDollarSign,
  Pill,
  Plane,
  Repeat2,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { calcCategoryBreakdown, getCategoryMeta } from "@/lib/cardsLogic";
import { formatBRL } from "@/lib/money";

const CATEGORY_ICONS = {
  food: UtensilsCrossed,
  transport: CarFront,
  health: Pill,
  shopping: ShoppingBag,
  travel: Plane,
  subscription: Repeat2,
  utility: Zap,
};

/**
 * Analítico simples de categoria por cartão. Mostra a categoria dominante,
 * lista as demais em barras horizontais empilhadas e ajuda o usuário a
 * decidir onde gastar (ou economizar) em cada plástico.
 */
export function CategoryBreakdown({ card, limit = 4 }) {
  const breakdown = calcCategoryBreakdown(card);
  if (breakdown.length === 0) return null;

  const visible = breakdown.slice(0, limit);
  const dominant = visible[0];
  const dominantMeta = getCategoryMeta(dominant.category);
  const DominantIcon = CATEGORY_ICONS[dominant.category] || CircleDollarSign;
  const totalVisible = visible.reduce((sum, item) => sum + item.cents, 0);

  return (
    <section className="fox-card category-breakdown" data-testid="category-breakdown">
      <header className="category-head">
        <div className="category-head-copy">
          <span className="category-eyebrow">
            <Sparkles size={12} strokeWidth={2.4} />
            Onde esse cartão mais gasta
          </span>
          <strong>{dominantMeta.label}</strong>
          <span className="fox-muted category-head-hint">
            {dominant.percent}% dos gastos · {formatBRL(dominant.cents)}
          </span>
        </div>
        <span
          className="category-dominant-icon"
          style={{ color: dominantMeta.color, background: `${dominantMeta.color}22` }}
          aria-hidden="true"
        >
          <DominantIcon size={20} strokeWidth={2} />
        </span>
      </header>

      <div className="category-stack" data-testid="category-stack">
        {visible.map((item) => {
          const meta = getCategoryMeta(item.category);
          const share = totalVisible ? (item.cents / totalVisible) * 100 : 0;
          return (
            <span
              key={item.category}
              className="category-stack-segment"
              style={{ width: `${share}%`, background: meta.color }}
              title={`${meta.label} · ${item.percent}%`}
              aria-label={`${meta.label}: ${item.percent}%`}
            />
          );
        })}
      </div>

      <ul className="category-list" data-testid="category-list">
        {visible.map((item) => {
          const meta = getCategoryMeta(item.category);
          const Icon = CATEGORY_ICONS[item.category] || CircleDollarSign;
          return (
            <li key={item.category} data-testid={`category-item-${item.category}`}>
              <span
                className="category-list-icon"
                style={{ color: meta.color, background: `${meta.color}1f` }}
                aria-hidden="true"
              >
                <Icon size={14} strokeWidth={2.2} />
              </span>
              <span className="category-list-name">{meta.label}</span>
              <span className="category-list-value">{formatBRL(item.cents)}</span>
              <span className="category-list-percent" style={{ color: meta.color }}>
                {item.percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
