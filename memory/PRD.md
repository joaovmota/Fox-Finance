# Fox — PRD de Constituição

## Problema original
Construir incrementalmente o Fox — aplicativo de controle financeiro pessoal. O Prompt 01 criou a fundação visual; o Prompt 02 adiciona o núcleo Supabase/PostgreSQL, autenticação, schema relacional, RLS, serviços e regras financeiras sem implementar as telas financeiras completas.

## Data
2026-08-11

## Decisões de arquitetura
- Preservada a stack React existente em JavaScript, evitando migração ampla para TypeScript nesta fundação.
- App Shell compartilhado com Header, conteúdo roteado, Bottom Navigation e FAB.
- Tokens visuais centralizados em CSS variables para dark padrão e light preparado.
- Mocks financeiros isolados em `src/lib/mocks.js`, sem persistência ou banco financeiro.
- Rotas futuras usam placeholders para manter separação por domínio e permitir evolução incremental.

## Personas
- Pessoa que quer visualizar sua vida financeira com clareza e baixa fricção.
- Usuário mobile-first que precisa acessar rapidamente as áreas principais.

## Requisitos centrais estáticos
- Identidade Fox: fundo quase preto, superfícies verde-petróleo, primary turquesa, semântica positiva/negativa/alerta e tipografia Inter.
- Dark mode inicial e light mode coerente.
- App Shell, Header, navegação inferior, FAB, rotas base, componentes e estados básicos.
- Responsividade, foco visível, labels, áreas de toque e prefers-reduced-motion.
- Nenhum módulo financeiro real, autenticação, banco definitivo, integração, pagamento ou deploy nesta etapa.

## Implementado
- App Shell reutilizável com Header, BottomNavigation, FAB e modal placeholder.
- Rota de fundação com saudação, saldo mockado, métricas, chips, insight, progresso e movimentações de exemplo.
- Rotas `/`, `/timeline`, `/people`, `/cards`, `/planning`, `/goals`, `/investments`, `/reports` e fallback de erro.
- Componentes Fox: Button, IconButton, Card, MetricCard, Chip, Badge, ProgressBar, Skeleton, EmptyState, ErrorState e Modal.
- Tema dark/light com tokens, animações de entrada, estados hover/focus e layout mobile-first.
- Validação de build, lint e Playwright frontend concluída em 2026-08-11.

## Prompt 02 implementado
- Cliente Supabase no frontend com Project URL e Publishable Key, sessão persistente e AuthProvider.
- Login, cadastro, logout programático, restauração de sessão, proteção de rota e estados de autenticação.
- PostgreSQL Supabase aplicado via migration: 17 entidades, enums, constraints, foreign keys e índices.
- RLS aplicado nas 17 tabelas com policies explícitas de ownership por `auth.uid()`.
- Trigger de profile após cadastro, com migration corretiva idempotente `002_idempotent_profile_trigger.sql`.
- Camada de repositories e funções financeiras fora da UI, usando centavos no frontend e `numeric(14,2)` no banco.
- Documentação em `docs/architecture` e `docs/database`.
- Testes: build/lint, endpoint público Supabase, migration remota, RLS estrutural, autenticação visual, rota protegida, mobile overflow e segurança estática.

## Incremento do Dashboard
- Adicionados quatro atalhos abaixo do saldo: Despesa, Receita, Cartão e Invest.
- Formulários mockados com valor, descrição, conta, categoria, data, recorrência e meios de pagamento.
- Cartão possui seleção de cartão, débito/crédito e parcelas de 1x a 5x ou quantidade manual.
- Categoria Terceiros abre vínculo com pessoa existente ou criação local, distinguindo a receber e a pagar.
- Nenhum formulário grava no Supabase ainda; persistência será ligada no próximo incremento após validação da experiência.
- Modal reformulado conforme protótipo: abas de movimentação, valor com máscara BRL, layout compacto, scroll interno e bloqueio do scroll do dashboard.
- FAB central agora abre o mesmo modal de Nova movimentação, iniciando em Despesa.

## Módulo Pessoas — interface inicial
- Rota `/people` com totais A RECEBER/A PAGAR, busca, lista de contatos e cadastro mockado.
- Rota `/people/:personId` com avatar, situação financeira, ações de recebimento/pagamento, pendentes, histórico e detalhes de cartão.
- Dados de Pessoas preparados em `src/lib/peopleMocks.js` para posterior troca por repositories do Supabase.
- Barra inferior reorganizada com coluna estrutural exclusiva para o FAB; Cartões não intercepta mais cliques no mobile.

## Backlog priorizado
### P0
- Criar usuário de teste dedicado e validar RLS com dois usuários reais em ambiente seguro.
- Validar confirmação de e-mail e URLs de redirect no painel Supabase.

### P1
- Transformar placeholders em módulos com dados reais sem alterar o App Shell.
- Adicionar testes automatizados de repository e policies via ambiente de teste.
- Persistir lançamentos dos atalhos e gerar parcelas/faturas de cartão de forma atômica.

### P2
- Notificações, IA financeira, integrações externas, pagamentos e relatórios avançados.

## Próximas tarefas
1. Criar credenciais de teste não produtivas para validar Auth e isolamento multiusuário.
2. Confirmar configurações de e-mail/redirect no Supabase.
3. No Prompt 03, substituir mocks por serviços/repositories mantendo os componentes base.
