import { useEffect } from "react";
import { LoaderCircle, X } from "lucide-react";

let modalDepth = 0;

export function Button({ children, variant = "primary", loading = false, ...props }) {
  return <button className={`fox-button fox-button-${variant}`} disabled={loading || props.disabled} {...props}>
    {loading && <LoaderCircle size={16} className="fox-spin" />}{children}
  </button>;
}

export function IconButton({ label, children, ...props }) {
  return <button className="fox-icon-button" aria-label={label} data-testid={props["data-testid"]} {...props}>{children}</button>;
}

export function Card({ children, className = "", ...props }) { return <section className={`fox-card ${className}`} {...props}>{children}</section>; }

export function MetricCard({ label, value, detail, tone = "default", icon }) {
  return <Card className="fox-metric-card" data-testid={`metric-card-${label.toLowerCase().replaceAll(" ", "-")}`}>
    <div className="fox-metric-top"><span className="fox-muted">{label}</span>{icon}</div>
    <strong className={`fox-metric-value fox-tone-${tone}`}>{value}</strong>
    <span className="fox-metric-detail">{detail}</span>
  </Card>;
}

export function Chip({ children, active = false, ...props }) { return <button className={`fox-chip ${active ? "is-active" : ""}`} {...props}>{children}</button>; }
export function Badge({ children, tone = "default" }) { return <span className={`fox-badge fox-badge-${tone}`}>{children}</span>; }
export function ProgressBar({ value }) { return <div className="fox-progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" data-testid="progress-bar"><span style={{ width: `${value}%` }} /></div>; }
export function Skeleton({ className = "" }) { return <div className={`fox-skeleton ${className}`} aria-label="Carregando" data-testid="loading-skeleton" />; }
export function EmptyState({ title, description, action }) { return <div className="fox-empty" data-testid="empty-state"><div className="fox-empty-icon">∅</div><h3>{title}</h3><p>{description}</p>{action}</div>; }
export function ErrorState({ title = "Algo não saiu como esperado", description = "Tente novamente em alguns instantes." }) { return <div className="fox-empty fox-error" role="alert" data-testid="error-state"><div className="fox-empty-icon">!</div><h3>{title}</h3><p>{description}</p><Button variant="secondary" onClick={() => window.location.reload()} data-testid="error-retry-button">Tentar novamente</Button></div>; }
export function Modal({ title, children, onClose, testId = "placeholder-modal", titleId = "modal-title" }) {
  const closeTestId = testId === "placeholder-modal" ? "modal-close-button" : `${testId}-close-button`;
  useEffect(() => { modalDepth += 1; const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { modalDepth -= 1; if (modalDepth === 0) document.body.style.overflow = previousOverflow; }; }, []);
  return <div className="fox-modal-backdrop" role="presentation"><div className="fox-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid={testId}><div className="fox-modal-header"><h2 id={titleId}>{title}</h2><IconButton label="Fechar" onClick={onClose} data-testid={closeTestId}><X size={18} /></IconButton></div>{children}</div></div>;
}