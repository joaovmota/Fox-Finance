import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CardCarousel } from "@/components/cards/CardCarousel";
import { CardSummary } from "@/components/cards/CardSummary";
import { CardDates } from "@/components/cards/CardDates";
import { CardTransactions } from "@/components/cards/CardTransactions";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { cardsMock } from "@/lib/cardsMocks";

export default function Cards() {
  const [cards, setCards] = useState(cardsMock);
  const [activeId, setActiveId] = useState(cardsMock[0]?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);

  const activeCard = useMemo(
    () => cards.find((card) => card.id === activeId) ?? cards[0],
    [cards, activeId],
  );

  const handleAdd = (payload) => {
    const id = `${payload.brandKey}-${Date.now()}`;
    const newCard = { id, ...payload };
    setCards((current) => [...current, newCard]);
    setActiveId(id);
    setShowAdd(false);
    toast.success("Cartão adicionado (MOCK)", {
      description: `${newCard.apelido} — limite gerenciado localmente.`,
    });
  };

  return (
    <div className="fox-page cards-page">
      <header className="cards-heading">
        <div>
          <h1 className="fox-display">Cartões</h1>
          <span className="fox-muted" data-testid="cards-active-count">
            {cards.length} {cards.length === 1 ? "cartão ativo" : "cartões ativos"}
          </span>
        </div>
        <button
          type="button"
          className="cards-add-button"
          onClick={() => setShowAdd(true)}
          data-testid="cards-add-button"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </header>

      {cards.length === 0 ? (
        <div className="cards-empty" data-testid="cards-empty">
          <p className="fox-muted">
            Nenhum cartão cadastrado. Toque em <strong>+ Adicionar</strong> para criar o primeiro.
          </p>
        </div>
      ) : (
        <>
          <CardCarousel cards={cards} activeId={activeId} onActiveChange={setActiveId} />
          {activeCard && (
            <>
              <CardSummary card={activeCard} />
              <CardDates card={activeCard} />
              <CardTransactions card={activeCard} />
            </>
          )}
        </>
      )}

      {showAdd && <AddCardModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
    </div>
  );
}
