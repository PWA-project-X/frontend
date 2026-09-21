# Frontend — Portfólio Interno Miniverso

Aplicação web com **React + TypeScript + Vite** e suporte a **PWA** (`vite-plugin-pwa`) para o Portfólio Interno Miniverso.

Documentação técnica: [`docs/`](docs/) · Contribuição: [`CONTRIBUTING.md`](CONTRIBUTING.md) · Changelog: [`CHANGELOG.md`](CHANGELOG.md)

## Pré-requisitos

- Node.js
- npm
- Backend local em `http://localhost:3001` (opcional — há fallback de conteúdo)

## Instalação

```bash
npm install
cp .env.example .env
```

## Desenvolvimento

Suba o backend em outro terminal (`npm run dev` no repositório backend) e depois:

```bash
npm run dev
```

O front usa `VITE_API_URL` (padrão `http://localhost:3001`) para buscar `/api/company`, `/api/services`, `/api/projects` e `/api/process`. Se a API estiver indisponível, o conteúdo local em `src/data/content.ts` é usado automaticamente e um aviso discreto aparece no topo.

Contrato da API: ver README do [backend](https://github.com/PWA-project-X/backend).

### Testar o fallback

1. Pare o backend
2. Recarregue o front em `http://localhost:5173`
3. Confirme o aviso “Conteúdo local — API indisponível” e o conteúdo das seções

## Seções

1. **Início** — apresentação do projeto
2. **Sobre** — proposta e contexto da empresa
3. **Serviços** — cards com áreas de atuação
4. **Projetos** — exemplos de experiências e simulações
5. **Processo** — entender, criar e entregar

## Direção visual (Orbital Clean)

Interface futurista e limpa: tipografia **Syne** + **DM Sans**, tokens com accent ciano-água, hero full-bleed com marca em destaque, header priorizando navegação, ritmo entre seções, cards diferenciados (serviços com índice / projetos com chip), linha no processo e footer mínimo — sempre respeitando `prefers-reduced-motion`.

## PWA (produção / preview)

```bash
npm run build
npm run preview
```

## Estrutura de componentes

```
src/components/
  header/          Header.tsx + style.css
  homeSection/     HomeSection.tsx + style.css
  aboutSection/    AboutSection.tsx + style.css
  servicesSection/ ServicesSection.tsx + style.css
  serviceCard/     ServiceCard.tsx + style.css
  projectsSection/ ProjectsSection.tsx + style.css
  projectCard/     ProjectCard.tsx + style.css
  processSection/  ProcessSection.tsx + style.css
  processStep/     ProcessStep.tsx + style.css
  footer/          SiteFooter.tsx + style.css
  buttonHome/      ButtonHome.tsx + style.css
  buttonPrev/      ButtonPrev.tsx + style.css
  buttonNext/      ButtonNext.tsx + style.css
  buttonScrollTop/ ButtonScrollTop.tsx + style.css
src/styles/
  tokens.css       Variáveis de design (Orbital Clean)
src/hooks/
  useRevealOnScroll.ts
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (+ service worker) |
| `npm run preview` | Preview do build (teste PWA) |
| `npm run lint` | ESLint |

## Requisitos cobertos (escopo PDF v0.1)

| ID | Descrição | Status |
| --- | --- | --- |
| RF01 | Página inicial com nome e proposta | Feito |
| RF02 | Seção Sobre | Feito |
| RF03 | Serviços em cards | Feito |
| RF04 | Projetos selecionados | Feito |
| RF05 | Seção de processo | Feito |
| RF06 | Navegação por links entre seções | Feito |
| RF07 | Retornar ao topo | Feito |
| RF08 | Interface responsiva (mobile) | Feito |
| RF09 | Dados via API | Feito |
| RF10 | Fallback local | Feito |
| RF12 | Configuração PWA | Feito |
| RF13 | Artigos / insights | Não na v1 (opcional) |
| RF14 | Contato visual | Não na v1 (opcional) |
| RNF01 | React + TypeScript + Vite | Feito |
| RNF03–RNF06 | Responsivo, contraste, componentes, scripts | Feito |
| RNF08–RNF10 | Conteúdo em arquivos, assets leves, reduced-motion | Feito |

Matriz completa: [`docs/TRACEABILITY.md`](docs/TRACEABILITY.md). Checklist: [`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md).

## Backend

API em: [PWA-project-X/backend](https://github.com/PWA-project-X/backend)
