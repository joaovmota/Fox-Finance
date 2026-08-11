export function toCents(value) {
  if (typeof value === "number") return Math.round(value * 100);
  const normalized = String(value).replace(/\s/g, "").replace("R$", "").replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount)) throw new Error("Invalid monetary value");
  return Math.round(amount * 100);
}

export function fromCents(cents) { return (cents / 100).toFixed(2); }
export function formatBRL(cents) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100); }