// Fonte de verdade para bancos suportados. `cor` é usada como cor de fundo
// dinâmica do cartão no carousel e `corTexto` como cor da tipografia sobre ele.
export const banks = [
  { id: "nubank", nome: "Nubank", cor: "#8A05BE", corTexto: "#FFFFFF" },
  { id: "inter", nome: "Banco Inter", cor: "#FF5800", corTexto: "#FFFFFF" },
  { id: "c6bank", nome: "C6 Bank", cor: "#242424", corTexto: "#FFFFFF" },
  { id: "picpay", nome: "PicPay", cor: "#11C76F", corTexto: "#FFFFFF" },
  { id: "mercadopago", nome: "Mercado Pago", cor: "#009EE3", corTexto: "#FFFFFF" },
  { id: "neon", nome: "Neon", cor: "#00A3FF", corTexto: "#FFFFFF" },
  { id: "next", nome: "Next", cor: "#00FF7F", corTexto: "#000000" },
  { id: "pagbank", nome: "PagBank", cor: "#00C853", corTexto: "#FFFFFF" },
  { id: "willbank", nome: "Will Bank", cor: "#FFD200", corTexto: "#000000" },
  { id: "btg", nome: "BTG Pactual", cor: "#001E62", corTexto: "#FFFFFF" },
  { id: "xp", nome: "XP Investimentos", cor: "#000000", corTexto: "#FFFFFF" },
  { id: "itau", nome: "Itaú", cor: "#EC7000", corTexto: "#FFFFFF" },
  { id: "bradesco", nome: "Bradesco", cor: "#CC092F", corTexto: "#FFFFFF" },
  { id: "santander", nome: "Santander", cor: "#EC0000", corTexto: "#FFFFFF" },
  { id: "bb", nome: "Banco do Brasil", cor: "#0038A8", corTexto: "#FFFFFF" },
  { id: "caixa", nome: "Caixa Econômica", cor: "#005CA9", corTexto: "#FFFFFF" },
  { id: "sicoob", nome: "Sicoob", cor: "#003627", corTexto: "#FFFFFF" },
  { id: "sicredi", nome: "Sicredi", cor: "#00A84F", corTexto: "#FFFFFF" },
  { id: "pan", nome: "Banco Pan", cor: "#0082FF", corTexto: "#FFFFFF" },
  { id: "bmg", nome: "Banco BMG", cor: "#FF7300", corTexto: "#FFFFFF" },
  { id: "digio", nome: "Digio", cor: "#00133F", corTexto: "#FFFFFF" },
  { id: "safra", nome: "Banco Safra", cor: "#002A54", corTexto: "#FFFFFF" },
  { id: "sofisa", nome: "Sofisa Direto", cor: "#92D400", corTexto: "#000000" },
  { id: "rico", nome: "Rico", cor: "#FF4C00", corTexto: "#FFFFFF" },
  { id: "nomad", nome: "Nomad", cor: "#F2EA00", corTexto: "#000000" },
  { id: "avenue", nome: "Avenue", cor: "#001530", corTexto: "#FFFFFF" },
  { id: "agibank", nome: "Agibank", cor: "#009E5A", corTexto: "#FFFFFF" },
  { id: "bv", nome: "Banco BV", cor: "#00B5E2", corTexto: "#000000" },
  { id: "brb", nome: "BRB", cor: "#006CB5", corTexto: "#FFFFFF" },
  { id: "banestes", nome: "Banestes", cor: "#003882", corTexto: "#FFFFFF" },
  { id: "bnb", nome: "Banco do Nordeste", cor: "#007E44", corTexto: "#FFFFFF" },
  { id: "daycoval", nome: "Daycoval", cor: "#00305E", corTexto: "#FFFFFF" },
];

// Fallback usado quando o banco digitado não bate com nenhum item do catálogo.
export const GENERIC_BANK = {
  id: "generic",
  nome: "Cartão",
  cor: "#173638",
  corTexto: "#FFFFFF",
};

const norm = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Auto-suggest: retorna até `limit` bancos cujo nome contém o fragmento digitado.
// Ex.: "pan" → [Banco Pan], "banco" → [Banco Inter, Banco do Brasil, ...].
export function suggestBanks(input, limit = 6) {
  const query = norm(input);
  if (!query) return [];
  const startsWith = [];
  const contains = [];
  for (const bank of banks) {
    const name = norm(bank.nome);
    if (name === query || name.startsWith(query)) startsWith.push(bank);
    else if (name.includes(query)) contains.push(bank);
  }
  return [...startsWith, ...contains].slice(0, limit);
}

// Retorna o banco que melhor casa com o texto fornecido. Prioriza correspondência
// exata (case-insensitive), depois "começa com", depois "contém".
export function findBank(input) {
  const query = norm(input);
  if (!query) return null;
  let byPrefix = null;
  let byContains = null;
  for (const bank of banks) {
    const name = norm(bank.nome);
    if (name === query) return bank;
    if (!byPrefix && name.startsWith(query)) byPrefix = bank;
    if (!byContains && name.includes(query)) byContains = bank;
  }
  return byPrefix || byContains || null;
}
