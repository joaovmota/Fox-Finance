import { useState } from "react";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CreditCard, Plus, ReceiptText, UserRound } from "lucide-react";
import { Button, Modal } from "@/components/ui/fox";
import { entryMockOptions } from "@/lib/mocks";

const config = {
  expense: { title: "Despesa", eyebrow: "Saída", color: "negative", submit: "Registrar Despesa", Icon: ArrowDownLeft },
  income: { title: "Receita", eyebrow: "Entrada", color: "positive", submit: "Registrar Receita", Icon: ArrowUpRight },
  card: { title: "Cartão", eyebrow: "Cartão", color: "primary", submit: "Registrar Cartão", Icon: CreditCard },
  investment: { title: "Invest.", eyebrow: "Patrimônio", color: "positive", submit: "Registrar Investimento", Icon: ArrowUpRight },
  transfer: { title: "Transferência", eyebrow: "Entre contas", color: "primary", submit: "Registrar Transferência", Icon: ArrowLeftRight },
};
const tabs = ["expense", "income", "card", "transfer"];

function Field({ label, children, testId }) { return <label className="fox-entry-field" data-testid={testId}><span>{label}</span>{children}</label>; }
function formatBRLInput(raw) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(digits) / 100);
}

export default function QuickEntryModal({ type = "expense", onClose }) {
  const [activeType, setActiveType] = useState(type);
  const settings = config[activeType];
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(activeType === "investment" ? "Investimentos" : "Alimentação");
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [person, setPerson] = useState("");
  const [relationship, setRelationship] = useState("receivable");
  const [newPerson, setNewPerson] = useState("");
  const [payment, setPayment] = useState("Pix");
  const [creditMode, setCreditMode] = useState("debit");
  const [installments, setInstallments] = useState("1");

  const isCard = activeType === "card";
  const isInvestment = activeType === "investment";
  const isTransfer = activeType === "transfer";
  const showPeople = category === "Terceiros" && !isCard && !isInvestment && !isTransfer;
  const switchType = (nextType) => { setActiveType(nextType); setCategory(nextType === "investment" ? "Investimentos" : "Alimentação"); };
  const submit = (event) => { event.preventDefault(); onClose({ type: activeType, amount, category, person, relationship, payment, creditMode, installments }); };

  return <>
    <Modal title="Nova movimentação" onClose={() => onClose()} testId="entry-modal" titleId="entry-modal-title">
      <form className="fox-entry-form" onSubmit={submit} data-testid={`${activeType}-entry-form`}>
        <div className="fox-entry-tabs" role="tablist" aria-label="Tipo de movimentação" data-testid="entry-type-tabs">{tabs.map((tab) => { const item = config[tab]; const Icon = item.Icon; return <button type="button" role="tab" aria-selected={activeType === tab} className={`fox-entry-tab fox-${item.color} ${activeType === tab ? "active" : ""}`} onClick={() => switchType(tab)} key={tab} data-testid={`entry-tab-${tab}`}><Icon size={16} /><span>{item.title}</span></button>; })}</div>
        <span className={`fox-entry-eyebrow ${settings.color}`}>{settings.eyebrow}</span>
        <Field label="Valor" testId={`${activeType}-amount-field`}><div className="fox-money-input"><span>R$</span><input type="text" inputMode="numeric" value={amount} onChange={(event) => setAmount(formatBRLInput(event.target.value))} placeholder="0,00" required data-testid={`${activeType}-amount-input`} /></div></Field>
        <Field label="Descrição" testId={`${activeType}-description-field`}><input placeholder="Ex.: Almoço no sushi..." required data-testid={`${activeType}-description-input`} /></Field>
        {!isInvestment && !isTransfer && <Field label="Conta usada" testId={`${activeType}-account-field`}><select required data-testid={`${activeType}-account-select`}>{entryMockOptions.accounts.map((item) => <option key={item}>{item}</option>)}</select></Field>}
        {isTransfer && <div className="fox-entry-two-columns"><Field label="De" testId="transfer-source-field"><select required data-testid="transfer-source-select">{entryMockOptions.accounts.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Para" testId="transfer-destination-field"><select required data-testid="transfer-destination-select">{entryMockOptions.accounts.map((item) => <option key={item}>{item}</option>)}</select></Field></div>}
        {!isTransfer && <Field label="Categoria" testId={`${activeType}-category-field`}><select value={category} onChange={(event) => setCategory(event.target.value)} required data-testid={`${activeType}-category-select`}><option value="Investimentos">Investimentos</option>{entryMockOptions.categories.map((item) => <option key={item}>{item}</option>)}</select></Field>}
        <div className="fox-entry-two-columns"><Field label="Data" testId={`${activeType}-date-field`}><input type="date" defaultValue="2026-06-12" required data-testid={`${activeType}-date-input`} /></Field>{!isTransfer && <Field label="Recorrente" testId={`${activeType}-recurring-field`}><select data-testid={`${activeType}-recurring-select`}><option value="no">Não</option><option value="monthly">Mensal</option><option value="weekly">Semanal</option></select></Field>}</div>
        {!isInvestment && !isCard && !isTransfer && <Field label="Forma de pagamento" testId={`${activeType}-payment-field`}><select value={payment} onChange={(event) => setPayment(event.target.value)} data-testid={`${activeType}-payment-select`}>{entryMockOptions.paymentMethods.map((item) => <option key={item}>{item}</option>)}</select></Field>}
        {isCard && <><Field label="Cartão" testId="card-entry-card-field"><select required data-testid="card-entry-card-select">{entryMockOptions.cards.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Modalidade" testId="card-entry-mode-field"><div className="fox-segmented"><button type="button" className={creditMode === "debit" ? "active" : ""} onClick={() => setCreditMode("debit")} data-testid="card-entry-debit-button">Débito</button><button type="button" className={creditMode === "credit" ? "active" : ""} onClick={() => setCreditMode("credit")} data-testid="card-entry-credit-button">Crédito</button></div></Field>{creditMode === "credit" && <Field label="Parcelas" testId="card-entry-installments-field"><div className="fox-installments">{[1, 2, 3, 4, 5].map((item) => <button type="button" className={installments === String(item) ? "active" : ""} onClick={() => setInstallments(String(item))} key={item} data-testid={`card-entry-${item}x-button`}>{item}x</button>)}<button type="button" className={installments === "custom" ? "active" : ""} onClick={() => setInstallments("custom")} data-testid="card-entry-custom-button">Outra</button></div></Field>}{creditMode === "credit" && installments === "custom" && <Field label="Quantidade de parcelas" testId="card-entry-custom-installments-field"><input type="number" min="1" max="60" defaultValue="6" required data-testid="card-entry-custom-installments-input" /></Field>}</>}
        {showPeople && <div className="fox-person-link" data-testid="third-party-person-link"><UserRound size={17} /><div><strong>{person || "Nenhuma pessoa vinculada"}</strong><span>{person ? (relationship === "receivable" ? "A receber" : "A pagar") : "Vincule para acompanhar em Pessoas"}</span></div><Button type="button" variant="ghost" onClick={() => setShowPersonModal(true)} data-testid="open-person-picker-button">{person ? "Alterar" : "Vincular"}</Button></div>}
        <Button type="submit" data-testid={`${activeType}-entry-submit-button`}><ReceiptText size={16} />{settings.submit}</Button>
      </form>
    </Modal>
    {showPersonModal && <Modal title="Vincular pessoa" onClose={() => setShowPersonModal(false)} testId="person-picker-modal" titleId="person-picker-title"><div className="fox-person-picker"><span className="fox-muted">Essa relação aparecerá no módulo Pessoas.</span><div className="fox-person-options">{entryMockOptions.people.map((item) => <button type="button" key={item} className={`fox-person-option ${person === item ? "active" : ""}`} onClick={() => setPerson(item)} data-testid={`person-option-${item.toLowerCase().replaceAll(" ", "-")}`}><UserRound size={16} />{item}</button>)}</div><div className="fox-person-divider"><span>ou crie agora</span></div><div className="fox-person-create"><input value={newPerson} onChange={(event) => setNewPerson(event.target.value)} placeholder="Nome da pessoa" data-testid="new-person-name-input" /><Button type="button" variant="secondary" onClick={() => { if (newPerson.trim()) setPerson(newPerson.trim()); setShowPersonModal(false); }} data-testid="create-person-button"><Plus size={16} />Adicionar</Button></div><Field label="Como fica essa relação?" testId="person-relationship-field"><select value={relationship} onChange={(event) => setRelationship(event.target.value)} data-testid="person-relationship-select"><option value="receivable">Emprestei — a receber</option><option value="payable">Peguei emprestado — a pagar</option></select></Field><Button type="button" onClick={() => setShowPersonModal(false)} data-testid="confirm-person-link-button">Confirmar vínculo</Button></div></Modal>}
  </>;
}