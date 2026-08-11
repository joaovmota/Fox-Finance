import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, EmptyState, ErrorState } from "@/components/ui/fox";

export default function ModulePlaceholder({ title, error = false }) {
  const navigate = useNavigate();
  return <div className="fox-page fox-placeholder-page"><div className="fox-placeholder-top"><button className="fox-back-button" onClick={() => navigate(-1)} data-testid="placeholder-back-button"><ArrowLeft size={18} /> Voltar</button></div>{error ? <ErrorState title={title} description="Essa rota não existe na fundação atual." /> : <EmptyState title={`${title} em breve`} description={`A estrutura de ${title.toLowerCase()} está pronta para receber o próximo módulo do Fox.`} action={<Button variant="secondary" onClick={() => navigate("/")} data-testid="placeholder-home-button">Voltar ao início</Button>} />}</div>;
}