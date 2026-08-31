import { useMemo, useState } from "react";
import { BriefcaseBusiness, CarFront, CircleDollarSign, Lightbulb, Repeat2, Search, ShoppingBasket, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Chip, EmptyState } from "@/components/ui/fox";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { timelineMock } from "@/lib/mocks";

const filters = [{ id: "all", label: "Todos" }, { id: "income", label: "Receitas" }, { id: "expense", label: "Despesas" }, { id: "card", label: "Cartão" }, { id: "recurring", label: "Recorrentes" }];
const icons = { food: ShoppingBasket, transport: CarFront, work: BriefcaseBusiness, utility: Zap };

function TimelineIcon({ name }) { const Icon = icons[name] || CircleDollarSign; return <span className={`timeline-icon ${name}`}><Icon size={18} /></span>; }

function inRange(iso, from, to) {
  if (!from && !to) return true;
  if (!iso) return true;
  if (from && iso < from) return false;
  if (to && iso > to) return false;
  return true;
}

export default function Timeline() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const filtered = useMemo(() => timelineMock.filter((item) => { const matchesFilter = filter === "all" || (filter === "recurring" ? item.recurring : item.type === filter); const searchable = `${item.name} ${item.category} ${item.description}`.toLowerCase(); return matchesFilter && searchable.includes(query.toLowerCase()) && inRange(item.dateISO, range.from, range.to); }), [filter, query, range]);
  const grouped = filtered.reduce((groups, item) => ({ ...groups, [item.date]: [...(groups[item.date] || []), item] }), {});
  return <div className="fox-page timeline-page"><section className="timeline-heading"><div><span className="fox-eyebrow">Histórico financeiro</span><h1 className="fox-display">Timeline</h1></div><Link to="/" className="timeline-home-link" data-testid="timeline-home-link">Início</Link></section><section className="timeline-summary"><Card data-testid="timeline-income-summary"><span>↑ Entradas</span><strong className="positive">R$ 9.934,60</strong></Card><Card data-testid="timeline-expense-summary"><span>↓ Saídas</span><strong className="negative">R$ 3.348,00</strong></Card></section><div className="timeline-controls"><label className="timeline-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar movimentações..." data-testid="timeline-search-input" /></label><DateRangePicker value={range} onChange={setRange} testId="timeline-range" placeholder="Período" /></div><div className="timeline-filters" role="tablist" aria-label="Filtros da timeline" data-testid="timeline-filters">{filters.map((item) => <Chip active={filter === item.id} onClick={() => setFilter(item.id)} key={item.id} data-testid={`timeline-filter-${item.id}`}>{item.label}</Chip>)}</div><div className="timeline-groups" data-testid="timeline-list">{Object.keys(grouped).length === 0 ? <EmptyState title="Nenhuma movimentação encontrada" description="Tente ajustar sua busca, filtro ou período." /> : Object.entries(grouped).map(([date, items]) => <section className="timeline-group" key={date}><div className="timeline-group-heading"><h2>{date}</h2><strong>{items.reduce((total, item) => total + (item.type === "income" ? 1 : -1) * Number(item.value.replace(/[^0-9,-]/g, "").replace(".", "").replace(",", ".")), 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><Card className="timeline-items">{items.map((item) => <article className="timeline-item" key={item.id} data-testid={`timeline-item-${item.id}`}><TimelineIcon name={item.icon} /><div className="timeline-item-copy"><strong>{item.name}</strong><span>{item.category} · {item.description} · {item.time}{item.recurring && <Repeat2 size={12} />}</span></div><strong className={`timeline-item-value ${item.type}`}>{item.value}</strong></article>)}</Card></section>)}</div><div className="timeline-note"><Lightbulb size={15} /> Dados de demonstração preparados para receber lançamentos reais</div></div>;
}