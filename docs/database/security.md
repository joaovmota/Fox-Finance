# Fox — Segurança do banco

- Todas as tabelas privadas usam Row Level Security.
- As policies usam `auth.uid()` como ownership.
- Profiles relaciona `user_id` com `auth.users(id)`.
- Chaves públicas podem aparecer no frontend; Service Role Key nunca deve ser usada no navegador.
- Cartões armazenam apenas `last_four`; não armazenam número completo nem CVV.
- A migration em `supabase/migrations/001_fox_financial_foundation.sql` é a fonte versionável do schema.