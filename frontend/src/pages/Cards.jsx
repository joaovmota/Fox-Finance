import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CardCarousel } from "@/components/cards/CardCarousel";
import { CardSummary } from "@/components/cards/CardSummary";
import { CardDates } from "@/components/cards/CardDates";
import { CardTransactions } from "@/components/cards/CardTransactions";
import { CardActionsRow } from "@/components/cards/CardActionsRow";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { EditCardModal } from "@/components/cards/EditCardModal";
import { DeleteCardDialog } from "@/components/cards/DeleteCardDialog";
import { InvoiceDetailModal } from "@/components/cards/InvoiceDetailModal";
import { RewardsCard } from "@/components/cards/RewardsCard";
import { DueAlert } from "@/components/cards/DueAlert";
import { cardsMock } from "@/lib/cardsMocks";

// Fixed "demo now" so the mock cycles / proximity labels stay coherent with
// the reference mockups. Replace by `new Date()` once real data is wired in.
const DEMO_NOW = new Date(2026, 7, 9); // 9 Aug 2026

export default function Cards() {
  const [cards, setCards] = useState(cardsMock);
  const [activeId, setActiveId] = useState(cardsMock[0]?.id ?? null);
  const [dialog, setDialog] = useState(null); // "add" | "edit" | "delete" | "invoice"

  const activeCard = useMemo(
    () => cards.find((card) => card.id === activeId) ?? cards[0],
    [cards, activeId],
  );

  const openDialog = (name) => setDialog(name);
  const closeDialog = () => setDialog(null);

  const handleAdd = (payload) => {
    const id = `${payload.brandKey}-${Date.now()}`;
    const newCard = {
      id,
      rewards: null,
      ...payload,
    };
    setCards((current) => [...current, newCard]);
    setActiveId(id);
    closeDialog();
    toast.success("Cartão adicionado (MOCK)", {
      description: `${newCard.apelido} — limite gerenciado localmente.`,
    });
  };

  const handleEdit = (updated) => {
    setCards((current) => current.map((card) => (card.id === updated.id ? updated : card)));
    closeDialog();
    toast.success("Cartão atualizado", { description: updated.apelido });
  };

  const handleDelete = () => {
    if (!activeCard) return;
    const removedName = activeCard.apelido;
    setCards((current) => {
      const next = current.filter((card) => card.id !== activeCard.id);
      if (next.length && activeCard.id === activeId) setActiveId(next[0].id);
      return next;
    });
    closeDialog();
    toast.success("Cartão removido", { description: removedName });
  };

  const handleRewardsToggle = () => {
    if (!activeCard?.rewards) return;
    const nextEnabled = !activeCard.rewards.enabled;
    setCards((current) =>
      current.map((card) =>
        card.id === activeCard.id
          ? { ...card, rewards: { ...card.rewards, enabled: nextEnabled } }
          : card,
      ),
    );
    toast.success(nextEnabled ? "Programa de recompensas ativado" : "Programa desligado");
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
          onClick={() => openDialog("add")}
          data-testid="cards-add-button"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </header>

      <DueAlert cards={cards} activeId={activeId} onFocus={setActiveId} now={DEMO_NOW} />

      {cards.length === 0 ? (
        <div className="cards-empty" data-testid="cards-empty">
          <p className="fox-muted">
            Nenhum cartão cadastrado. Toque em <strong>+ Adicionar</strong> para criar o primeiro.
          </p>
        </div>
      ) : (
        <>
          <CardCarousel cards={cards} activeId={activeId} onActiveChange={setActiveId} now={DEMO_NOW} />
          {activeCard && (
            <>
              <CardSummary card={activeCard} now={DEMO_NOW} />
              <CardActionsRow
                onEdit={() => openDialog("edit")}
                onInvoice={() => openDialog("invoice")}
                onDelete={() => openDialog("delete")}
              />
              <CardDates card={activeCard} now={DEMO_NOW} />
              <RewardsCard card={activeCard} onToggle={handleRewardsToggle} />
              <CardTransactions card={activeCard} />
            </>
          )}
        </>
      )}

      {dialog === "add" && <AddCardModal onClose={closeDialog} onSubmit={handleAdd} />}
      {dialog === "edit" && activeCard && (
        <EditCardModal card={activeCard} onClose={closeDialog} onSubmit={handleEdit} />
      )}
      {dialog === "delete" && activeCard && (
        <DeleteCardDialog card={activeCard} onCancel={closeDialog} onConfirm={handleDelete} />
      )}
      {dialog === "invoice" && activeCard && (
        <InvoiceDetailModal card={activeCard} onClose={closeDialog} now={DEMO_NOW} />
      )}
    </div>
  );
}
