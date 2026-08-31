import { useState } from "react";
import { Trash2, UserPlus2, Users } from "lucide-react";
import { capitalizeWords } from "@/components/cards/AddCardModal";

function DependentRow({ dependent, onToggle, onRemove }) {
  return (
    <li className="dependent-row" data-testid={`dependent-${dependent.id}`}>
      <div className="dependent-info">
        <strong>{dependent.name}</strong>
        <span className="fox-muted">final {dependent.lastFour}</span>
      </div>
      <label className="dependent-toggle" data-testid={`dependent-toggle-${dependent.id}`}>
        <input
          type="checkbox"
          checked={dependent.active}
          onChange={() => onToggle(dependent.id)}
        />
        <span aria-hidden="true" />
        <span className="dependent-toggle-label">
          {dependent.active ? "Ativo" : "Pausado"}
        </span>
      </label>
      <button
        type="button"
        className="dependent-remove"
        onClick={() => onRemove(dependent.id)}
        aria-label={`Remover ${dependent.name}`}
        data-testid={`dependent-remove-${dependent.id}`}
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

/**
 * Gerenciador de cartões adicionais atrelados ao titular. Divide fatura com
 * dependentes (o limite total permanece no titular). Persiste alterações no
 * form do EditCardModal via `onChange`.
 */
export function DependentsManager({ dependents = [], onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLastFour, setNewLastFour] = useState("");
  const activeCount = dependents.filter((dep) => dep.active).length;

  const toggle = (id) => {
    onChange(
      dependents.map((dep) => (dep.id === id ? { ...dep, active: !dep.active } : dep)),
    );
  };

  const remove = (id) => {
    onChange(dependents.filter((dep) => dep.id !== id));
  };

  const add = (event) => {
    event.preventDefault();
    const name = newName.trim();
    const lastFour = newLastFour.replace(/\D/g, "").slice(-4);
    if (!name || lastFour.length !== 4) return;
    onChange([
      ...dependents,
      { id: `dep-${Date.now()}`, name, lastFour, active: true },
    ]);
    setNewName("");
    setNewLastFour("");
    setShowForm(false);
  };

  return (
    <section className="dependents-manager" data-testid="dependents-manager">
      <header className="dependents-header">
        <div>
          <span className="dependents-title">
            <Users size={13} strokeWidth={2.4} />
            Cartões adicionais
          </span>
          <span className="fox-muted dependents-count">
            {dependents.length === 0
              ? "Nenhum cartão adicional"
              : `${activeCount} de ${dependents.length} ativos · fatura compartilhada`}
          </span>
        </div>
        {!showForm && (
          <button
            type="button"
            className="dependents-add-btn"
            onClick={() => setShowForm(true)}
            data-testid="dependent-add-toggle"
          >
            <UserPlus2 size={14} />
            Adicionar
          </button>
        )}
      </header>

      {dependents.length > 0 && (
        <ul className="dependents-list">
          {dependents.map((dep) => (
            <DependentRow
              key={dep.id}
              dependent={dep}
              onToggle={toggle}
              onRemove={remove}
            />
          ))}
        </ul>
      )}

      {showForm && (
        <div className="dependents-form" data-testid="dependent-add-form">
          <div className="fox-entry-two-columns">
            <label className="fox-entry-field">
              Nome do titular adicional
              <input
                value={newName}
                onChange={(event) => setNewName(capitalizeWords(event.target.value))}
                placeholder="Ex.: Marina Souza"
                data-testid="new-dependent-name-input"
                autoFocus
              />
            </label>
            <label className="fox-entry-field">
              Últimos 4 dígitos
              <input
                value={newLastFour}
                onChange={(event) => setNewLastFour(event.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="0000"
                data-testid="new-dependent-lastfour-input"
              />
            </label>
          </div>
          <div className="dependents-form-actions">
            <button
              type="button"
              className="fox-dialog-button fox-dialog-button-cancel"
              onClick={() => setShowForm(false)}
              data-testid="new-dependent-cancel"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="fox-dialog-button fox-dialog-button-primary"
              onClick={add}
              disabled={!newName.trim() || newLastFour.length !== 4}
              data-testid="new-dependent-save"
            >
              <UserPlus2 size={14} />
              Cadastrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
