# Fox — Schema inicial

Entidades: profiles, accounts, categories, transactions, transaction_transfers, recurring_transactions, installments, people, cards, card_invoices, card_transactions, goals, goal_contributions, investments, investment_transactions, tags e transaction_tags.

Valores monetários são `numeric(14,2)`. Transferências são explicitamente separadas de receitas e despesas. Parcelas possuem vínculo obrigatório com a transação original. Categorias, pessoas, cartões, metas e investimentos possuem ownership pelo usuário.