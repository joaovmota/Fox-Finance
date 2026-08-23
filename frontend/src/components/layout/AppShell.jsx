import { useState } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import QuickEntryModal from "@/components/dashboard/QuickEntryModal";

export function AppShell({ children, theme, onToggleTheme }) {
  const [showFab, setShowFab] = useState(false);
  return <div className="fox-shell">
    <Header theme={theme} onToggleTheme={onToggleTheme} />
    <main>{children}</main>
    <BottomNavigation onFabClick={() => setShowFab(true)} />
    {showFab && <QuickEntryModal type="expense" onClose={() => setShowFab(false)} />}
  </div>;
}