export const foundationMock = {
  balance: "R$ 8.426,80",
  monthDelta: "+12,4% este mês",
  insight: "Você está mantendo um ritmo saudável de gastos esta semana.",
  entries: [
    { label: "Salário", detail: "Hoje, 08:42", value: "+ R$ 6.800,00", type: "positive", icon: "arrow-down-left" },
    { label: "Mercado do bairro", detail: "Ontem, 18:16", value: "− R$ 184,70", type: "negative", icon: "shopping-bag" },
  ],
};

export const entryMockOptions = {
  accounts: ["Conta principal", "Carteira", "Conta digital"],
  cards: ["Nubank •••• 4821", "Inter •••• 9034"],
  categories: ["Alimentação", "Transporte", "Moradia", "Lazer", "Terceiros"],
  people: ["Fabiane", "Marcos", "Ana Paula"],
  paymentMethods: ["Pix", "Dinheiro", "Débito", "Outro"],
};

export const timelineMock = [
  { id: "ramen", date: "Terça-feira, 4 de agosto", dateISO: "2026-08-04", name: "Ramen Boa Vista", category: "Alimentação", description: "Jantar", time: "13:20", value: "− R$ 68,50", type: "expense", icon: "food", recurring: false },
  { id: "uber", date: "Terça-feira, 4 de agosto", dateISO: "2026-08-04", name: "Uber", category: "Transporte", description: "Nubank", time: "10:05", value: "− R$ 24,90", type: "expense", icon: "transport", recurring: false },
  { id: "salary", date: "Segunda-feira, 3 de agosto", dateISO: "2026-08-03", name: "Salário Acme Corp", category: "Salário", description: "Receita mensal", time: "09:00", value: "+ R$ 9.800,00", type: "income", icon: "work", recurring: true },
  { id: "enel", date: "Segunda-feira, 3 de agosto", dateISO: "2026-08-03", name: "ENEL Energia", category: "Utilidades", description: "Conta de luz", time: "08:30", value: "− R$ 189,40", type: "expense", icon: "utility", recurring: true },
];