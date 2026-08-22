import { useState } from "react";
import { Plus, ReceiptText, UserRound } from "lucide-react";
import { Button, Modal } from "@/components/ui/fox";
import { entryMockOptions } from "@/lib/mocks";

const config = {
  expense: { title: "Nova despesa", eyebrow: "Saída", color: "negative", submit: "Salvar despesa" },
  income: { title: "Nova receita", eyebrow: "Entrada", color: "positive", submit: "Salvar receita" },
  card: { title: "Compra no cartão", eyebrow: "Cartão", color: "negative", submit: "Salvar compra" },
  investment: { title: "Novo investimento", eyebrow: "Patrimônio", color: "positive", submit: "Salvar investimento" },
};

function Field({ label, children, testId }) {
  return <label className="fox-entry-field" data-testid={testId}><span>{label}</span>{children}</label>;
}

export default function QuickEntryModal({ type, onClose }) {
  const settings = config[type];
  const [category, setCategory] = useState(type === "investment" ? "Investimentos" : "Alimentação");
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [person, setPerson] = useState("");
  const [relationship, setRelationship] = useState("receivable");
  const [newPerson, setNewPerson] = useState("");
  const [payment, setPayment] = useState("Pix");
  const [creditMode, setCreditMode] = useState("debit");
  const [installments, setInstallments] = useState("1");

  const isCard = type === "card";
  const isInvestment = type === "investment";
  const showPeople = category === "Terceiros";
  const submit = (event) => {
    event.preventDefault();
    onClose({ type, category, person, relationship, payment, creditMode, installments });
  };

  return <>
    <Modal title={settings.title} onClose={() => onClose()} testId="entry-modal" titleId="entry-modal-title">
      <form className="fox-entry-form" onSubmit={submit} data-testid={`${type}-entry-form`}>
        <span className={`fox-eyebrow fox-entry-eyebrow ${settings.color}`}>{settings.eyebrow}</span>
        <Field label="Valor" testId={`${type}-amount-field`}><input type="number" min="0.01" step="0.01" placeholder="R$ 0,00" required data-testid={`${type}-amount-input`} /></Field>
        <Field label="Descrição" testId={`${type}-description-field`}><input placeholder={isInvestment ? "Ex.: aporte mensal" : "Ex.: mercado da semana"} required data-testid={`${type}-description-input`} /></Field>
        {!isInvestment && <Field label="Conta usada" testId={`${type}-account-field`}><select required data-testid={`${type}-account-select`}>{entryMockOptions.accounts.map((item) => <option key={item}>{item}</option>)}</select></Field>}
        <div className="fox-entry-two-columns"><Field label="Categoria" testId={`${type}-category-field`}><select value={category} onChange={(event) => setCategory(event.target.value)} required data-testid={`${type}-category-select`}><option value="Investimentos">Investimentos</option>{entryMockOptions.categories.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Data" testId={`${type}-date-field`}><input type="date" defaultValue="2026-06-12" required data-testid={`${type}-date-input`} /></Field></div>
        {!isInvestment && !isCard && <Field label="Forma de pagamento" testId={`${type}-payment-field`}><select value={payment} onChange={(event) => setPayment(event.target.value)} data-testid={`${type}-payment-select`}>{entryMockOptions.paymentMethods.map((item) => <option key={item}>{item}</option>)}</select></Field>}
        {!isInvestment && !isCard && <Field label="Compra recorrente" testId={`${type}-recurring-field`}><select data-testid={`${type}-recurring-select`}><option value="no">Não</option><option value="monthly">Sim, mensal</option><option value="weekly">Sim, semanal</option></select></Field>}
        {isCard && <><Field label="Cartão" testId="card-entry-card-field"><select required data-testid="card-entry-card-select">{entryMockOptions.cards.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Modalidade" testId="card-entry-mode-field"><select value={creditMode} onChange={(event) => setCreditMode(event.target.value)} data-testid="card-entry-mode-select"><option value="debit">Débito</option><option value="credit">Crédito</option></select></Field>{creditMode === "credit" && <Field label="Parcelas" testId="card-entry-installments-field"><select value={installments} onChange={(event) => setInstallments(event.target.value)} data-testid="card-entry-installments-select">{[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}x</option>)}<option value="custom">Outra quantidade</option></select></Field>}{creditMode === "credit" && installments === "custom" && <Field label="Quantidade de parcelas" testId="card-entry-custom-installments-field"><input type="number" min="1" max="60" defaultValue="6" required data-testid="card-entry-custom-installments-input" /></Field>}</>}
        {isCard && <Field label="Compra recorrente" testId="card-entry-recurring-field"><select data-testid="card-entry-recurring-select"><option value="no">Não</option><option value="monthly">Sim, mensal</option></select></Field>}
        {showPeople && <div className="fox-person-link" data-testid="third-party-person-link"><UserRound size={17} /><div><strong>{person || "Nenhuma pessoa vinculada"}</strong><span>{person ? (relationship === "receivable" ? "A receber" : "A pagar") : "Vincule para acompanhar em Pessoas"}</span></div><Button type="button" variant="ghost" onClick={() => setShowPersonModal(true)} data-testid="open-person-picker-button">{person ? "Alterar" : "Vincular"}</Button></div>}
        <Button type="submit" variant={settings.color === "negative" ? "primary" : "primary"} data-testid={`${type}-entry-submit-button`}><ReceiptText size={16} />{settings.submit}</Button>
      </form>
    </Modal>
    {showPersonModal && <Modal title="Vincular pessoa" onClose={() => setShowPersonModal(false)} testId="person-picker-modal" titleId="person-picker-title"><div className="fox-person-picker"><span className="fox-muted">Essa relação aparecerá no módulo Pessoas.</span><div className="fox-person-options">{entryMockOptions.people.map((item) => <button type="button" key={item} className={`fox-person-option ${person === item ? "active" : ""}`} onClick={() => setPerson(item)} data-testid={`person-option-${item.toLowerCase().replaceAll(" ", "-")}`}><UserRound size={16} />{item}</button>)}</div><div className="fox-person-divider"><span>ou crie agora</span></div><div className="fox-person-create"><input value={newPerson} onChange={(event) => setNewPerson(event.target.value)} placeholder="Nome da pessoa" data-testid="new-person-name-input" /><Button type="button" variant="secondary" onClick={() => { if (newPerson.trim()) setPerson(newPerson.trim()); setShowPersonModal(false); }} data-testid="create-person-button"><Plus size={16} />Adicionar</Button></div><Field label="Como fica essa relação?" testId="person-relationship-field"><select value={relationship} onChange={(event) => setRelationship(event.target.value)} data-testid="person-relationship-select"><option value="receivable">Emprestei — a receber</option><option value="payable">Peguei emprestado — a pagar</option></select></Field><Button type="button" onClick={() => setShowPersonModal(false)} data-testid="confirm-person-link-button">Confirmar vínculo</Button></div></Modal>}
  </>;
}