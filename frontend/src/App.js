import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import FoundationHome from "@/pages/FoundationHome";
import ModulePlaceholder from "@/pages/ModulePlaceholder";
import AuthPage from "@/pages/AuthPage";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import Timeline from "@/pages/Timeline";
import People from "@/pages/People";
import PersonProfile from "@/pages/PersonProfile";
import "@/App.css";

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    toast.success(nextTheme === "dark" ? "Tema escuro ativado" : "Tema claro ativado", {
      id: "theme-toast",
    });
  };

  return (
    <div className={`fox-app ${theme}`} data-testid="fox-app">
      <BrowserRouter>
        <AppShell theme={theme} onToggleTheme={toggleTheme}>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/" element={<FoundationHome />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/people" element={<People />} />
            <Route path="/people/:personId" element={<PersonProfile />} />
            <Route path="/cards" element={<ModulePlaceholder title="Cartões" eyebrow="Organização" icon="credit-card" />} />
            <Route path="/planning" element={<ModulePlaceholder title="Planejamento" eyebrow="Próximo passo" icon="calendar-days" />} />
            <Route path="/goals" element={<ModulePlaceholder title="Objetivos" eyebrow="Próximo passo" icon="target" />} />
            <Route path="/investments" element={<ModulePlaceholder title="Investimentos" eyebrow="Próximo passo" icon="chart-no-axes-combined" />} />
            <Route path="/reports" element={<ModulePlaceholder title="Relatórios" eyebrow="Próximo passo" icon="file-chart-column" />} />
            <Route path="/accounts" element={<ModulePlaceholder title="Contas" eyebrow="Organização" icon="wallet-cards" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/secure-preview" element={<ModulePlaceholder title="Área protegida" />} />
            </Route>
            <Route path="*" element={<ModulePlaceholder title="Página não encontrada" eyebrow="Erro" icon="circle-alert" error />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      <Toaster position="top-center" richColors theme={theme} closeButton />
    </div>
  );
}

export default App;