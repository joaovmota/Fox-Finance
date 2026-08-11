import { NavLink } from "react-router-dom";
import { House, Activity, Users, CreditCard, Plus, Target, TrendingUp } from "lucide-react";

const links = [{ to: "/", label: "Início", icon: House }, { to: "/timeline", label: "Timeline", icon: Activity }, { to: "/people", label: "Pessoas", icon: Users }, { to: "/cards", label: "Cartões", icon: CreditCard }, { to: "/goals", label: "Objetivos", icon: Target }, { to: "/investments", label: "Investir", icon: TrendingUp }];
export function BottomNavigation({ onFabClick }) {
  return <nav className="fox-bottom-nav" aria-label="Navegação principal" data-testid="bottom-navigation"><div className="fox-nav-links">{links.map(({ to, label, icon: Icon }, index) => <NavLink key={to} to={to} end={index === 0} className={({ isActive }) => `fox-nav-item ${isActive ? "active" : ""}`} data-testid={`nav-${label.toLowerCase()}`}><Icon size={19} strokeWidth={2} /><span>{label}</span></NavLink>)}</div><button className="fox-fab" onClick={onFabClick} aria-label="Adicionar" data-testid="fab-add-button"><Plus size={25} /></button></nav>;
}