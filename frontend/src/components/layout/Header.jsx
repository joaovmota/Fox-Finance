import { Search, Sun, Moon, Bell } from "lucide-react";
import { IconButton } from "@/components/ui/fox";

export function Header({ theme, onToggleTheme }) {
  return <header className="fox-header" data-testid="app-header"><div className="fox-header-inner">
    <a className="fox-brand" href="/" data-testid="fox-brand-link"><span className="fox-brand-mark">F</span><span>Fox</span></a>
    <div className="fox-header-actions"><label className="fox-search"><Search size={17} /><input aria-label="Buscar" placeholder="Buscar" data-testid="header-search-input" /></label><IconButton label="Notificações" data-testid="header-notifications-button"><Bell size={18} /></IconButton><IconButton label="Alternar tema" onClick={onToggleTheme} data-testid="theme-toggle-button">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</IconButton><div className="fox-avatar" aria-label="Perfil de Rafael" data-testid="profile-avatar">R</div></div>
  </div></header>;
}