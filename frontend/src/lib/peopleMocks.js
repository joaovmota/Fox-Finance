export const peopleMock = [
  { id: "ana", name: "Ana Beatriz", initials: "AB", status: "payable", balance: "− R$ 340,00", detail: "2 pendências · Ontem", pending: [{ title: "Jantar no Outback", date: "4 ago", value: "− R$ 170,00" }, { title: "Ingresso show Bruno Mars", date: "1 ago", value: "− R$ 170,00" }], history: [{ title: "Pagamento parcial", date: "20 jul", value: "− R$ 200,00" }], card: { bank: "Nubank", lastFour: "4821", description: "Jantar no Outback", date: "4 ago", forecast: "Fatura de agosto" } },
  { id: "carlos", name: "Carlos Eduardo", initials: "CE", status: "receivable", balance: "+ R$ 520,00", detail: "1 pendência · 2 ago", pending: [{ title: "Transfer — aluguel compartilhado", date: "2 ago", value: "+ R$ 520,00" }], history: [{ title: "Pizza delivery", date: "20 jul", value: "+ R$ 60,00" }] },
  { id: "fernanda", name: "Juliana Lima", initials: "JL", status: "clear", balance: "—", detail: "Sem pendências · 1 jul", pending: [], history: [{ title: "Cinema", date: "1 jul", value: "R$ 42,00" }] },
  { id: "gabriel", name: "Gabriel Santos", initials: "GS", status: "payable", balance: "− R$ 89,90", detail: "1 pendência · 3 ago", pending: [{ title: "Presente compartilhado", date: "3 ago", value: "− R$ 89,90" }], history: [] },
];

export const peopleTotals = { receivable: "R$ 520,00", payable: "R$ 429,90" };