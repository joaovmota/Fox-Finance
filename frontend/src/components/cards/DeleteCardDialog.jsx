import { Trash2 } from "lucide-react";
import { Button, Modal } from "@/components/ui/fox";

export function DeleteCardDialog({ card, onCancel, onConfirm }) {
  return (
    <Modal
      title="Excluir cartão?"
      onClose={onCancel}
      testId="delete-card-dialog"
      titleId="delete-card-title"
    >
      <p className="fox-modal-copy">
        Você está prestes a remover o cartão{" "}
        <strong>{card.apelido}</strong> (final {card.lastFour}). Os lançamentos
        atrelados a ele serão desvinculados. Essa ação não pode ser desfeita.
      </p>
      <div className="delete-card-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          data-testid="delete-card-cancel"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="fox-button-danger"
          onClick={onConfirm}
          data-testid="delete-card-confirm"
        >
          <Trash2 size={16} />
          Excluir cartão
        </Button>
      </div>
    </Modal>
  );
}
