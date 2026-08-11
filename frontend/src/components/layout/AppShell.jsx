import { useState } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { Modal, Button } from "@/components/ui/fox";

export function AppShell({ children, theme, onToggleTheme }) {
  const [showFab, setShowFab] = useState(false);
  return <div className="fox-shell">
    <Header theme={theme} onToggleTheme={onToggleTheme} />
    <main>{children}</main>
    <BottomNavigation onFabClick={() => setShowFab(true)} />
    {showFab && <Modal title="Atalho rápido" onClose={() => setShowFab(false)}><p className="fox-modal-copy">O espaço para registrar algo novo estará disponível quando os módulos financeiros forem conectados.</p><Button variant="secondary" onClick={() => setShowFab(false)} data-testid="modal-understood-button">Entendi</Button></Modal>}
  </div>;
}