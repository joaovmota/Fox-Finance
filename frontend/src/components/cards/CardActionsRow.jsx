import { FileText, Pencil, Trash2 } from "lucide-react";

/**
 * Compact actions row for the currently selected card.
 * Keeps the coloured carousel clean while still exposing edit / delete /
 * invoice detail with plain buttons that are accessible on mobile.
 */
export function CardActionsRow({ onEdit, onInvoice, onDelete }) {
  return (
    <nav className="cards-actions" data-testid="cards-actions">
      <button
        type="button"
        className="cards-action-btn"
        onClick={onInvoice}
        data-testid="card-action-invoice"
      >
        <FileText size={15} />
        Ver fatura
      </button>
      <button
        type="button"
        className="cards-action-btn"
        onClick={onEdit}
        data-testid="card-action-edit"
      >
        <Pencil size={15} />
        Editar
      </button>
      <button
        type="button"
        className="cards-action-btn cards-action-danger"
        onClick={onDelete}
        data-testid="card-action-delete"
      >
        <Trash2 size={15} />
        Excluir
      </button>
    </nav>
  );
}
