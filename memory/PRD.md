# Fox — PRD de Constituição

## Problema original
Construir o Prompt 01 — Fundação do Fox, aplicativo de controle financeiro pessoal com identidade visual baseada no Figma fornecido, priorizando App Shell, sistema visual, componentes reutilizáveis, navegação, temas, estados e arquitetura preparada para crescimento.

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

## Backlog priorizado
### P0
- Definir regras oficiais em FOX_RULES.md antes de qualquer nova etapa, caso sejam disponibilizadas.
- Validar e ajustar tokens contra referências exportadas do Figma quando acessíveis.

### P1
- Prompt 02: escolher Supabase/PostgreSQL, modelar schema, migrations, RLS, autenticação e repositories.
- Transformar placeholders em módulos com dados reais sem alterar o App Shell.

### P2
- Notificações, IA financeira, integrações externas, pagamentos e relatórios avançados.

## Próximas tarefas
1. Obter/confirmar FOX_RULES.md e referências exportadas do Figma.
2. Planejar banco e autenticação no Prompt 02.
3. Substituir mocks por serviços/repositories mantendo os componentes base.
