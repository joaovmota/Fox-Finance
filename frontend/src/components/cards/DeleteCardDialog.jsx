import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/fox";

export function DeleteCardDialog({ card, onCancel, onConfirm }) {
  return (
    <Modal
      title="Excluir cartão?"
      onClose={onCancel}
      testId="delete-card-dialog"
      titleId="delete-card-title"
    >
      <p className="fox-modal-copy">
        Você está prestes a remover o cartão <strong>{card.apelido}</strong>{" "}
        (final {card.lastFour}). Os lançamentos atrelados a ele serão
        desvinculados. Essa ação não pode ser desfeita.
      </p>
      <div className="delete-card-actions">
        <button
          type="button"
          className="fox-dialog-button fox-dialog-button-cancel"
          onClick={onCancel}
          data-testid="delete-card-cancel"
        >
          Cancelar
        </button>
        <button
          type="button"
          className="fox-dialog-button fox-dialog-button-danger"
          onClick={onConfirm}
          data-testid="delete-card-confirm"
        >
          <Trash2 size={16} strokeWidth={2.2} />
          Excluir cartão
        </button>
      </div>
    </Modal>
  );
}
