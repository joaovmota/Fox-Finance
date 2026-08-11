import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card } from "@/components/ui/fox";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setBusy(true);
    const error = isSignup ? await signUp(form.email, form.password, form.name) : await signIn(form.email, form.password);
    setBusy(false);
    if (error) { toast.error(error); return; }
    if (isSignup) toast.success("Conta criada. Confira seu e-mail.");
    else navigate(location.state?.from?.pathname || "/");
  };
  return <div className="fox-page fox-auth-page"><Card className="fox-auth-card"><span className="fox-eyebrow">Fox • acesso seguro</span><h1 className="fox-display">{isSignup ? "Criar conta" : "Bem-vindo de volta"}<span className="fox-primary">.</span></h1><p className="fox-muted">Controle inteligente para a vida real.</p><form onSubmit={submit} className="fox-auth-form">{isSignup && <label>Nome<input value={form.name} onChange={update("name")} required data-testid="auth-name-input" /></label>}<label>E-mail<input type="email" value={form.email} onChange={update("email")} required data-testid="auth-email-input" /></label><label>Senha<input type="password" minLength="8" value={form.password} onChange={update("password")} required data-testid="auth-password-input" /></label><Button type="submit" loading={busy} data-testid="auth-submit-button">{isSignup ? "Criar conta" : "Entrar"}</Button></form><Link to={isSignup ? "/login" : "/signup"} className="fox-auth-link" data-testid="auth-mode-link">{isSignup ? "Já tenho uma conta" : "Ainda não tenho uma conta"}</Link></Card></div>;
}