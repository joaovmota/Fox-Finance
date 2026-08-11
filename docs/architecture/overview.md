# Fox — Arquitetura v0.2

## Camadas

`UI → Auth/Application → Domain Services → Repositories → Supabase → PostgreSQL/RLS`

O React não acessa tabelas diretamente nos componentes. O cliente Supabase usa somente a Project URL e a Publishable Key. A autorização é responsabilidade do RLS.

## Persistência

O PostgreSQL do Supabase é a fonte oficial dos dados do Fox. O MongoDB que veio no template permanece somente como infraestrutura genérica não utilizada pelo domínio financeiro.

## Autenticação

Supabase Auth mantém a sessão persistente e notifica mudanças via `onAuthStateChange`. A rota `/secure-preview` demonstra proteção sem alterar as telas públicas da fundação.

## Dinheiro

O banco usa `numeric(14,2)`. No frontend, `src/lib/money.js` usa centavos inteiros para evitar erros de ponto flutuante.