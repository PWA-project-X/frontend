# Frontend — Portfólio Interno Miniverso

Aplicação web com **React + TypeScript + Vite** e suporte a **PWA** (`vite-plugin-pwa`) para o Portfólio Interno Miniverso.

## Pré-requisitos

- Node.js
- npm
- Backend local em `http://localhost:3001` (opcional — há fallback de conteúdo)

## Instalação

```bash
npm install
```

## Desenvolvimento

Suba o backend em outro terminal (`npm run dev` no repositório backend) e depois:

```bash
npm run dev
```

O front usa `VITE_API_URL` (padrão `http://localhost:3001`) para buscar `/api/company`, `/api/services` e `/api/process`. Se a API estiver indisponível, o conteúdo local em `src/data/content.ts` é usado automaticamente e um aviso discreto aparece no topo.

### Testar o fallback

1. Pare o backend
2. Recarregue o front em `http://localhost:5173`
3. Confirme o aviso “Conteúdo local — API indisponível” e o conteúdo das seções

## Seções

1. **Início** — apresentação do projeto
2. **Sobre** — proposta e contexto da empresa
3. **Serviços** — cards com áreas de atuação
4. **Processo** — entender, criar e compartilhar

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
  processSection/  ProcessSection.tsx + style.css
  processStep/     ProcessStep.tsx + style.css
  buttonHome/      ButtonHome.tsx + style.css
  buttonPrev/      ButtonPrev.tsx + style.css
  buttonNext/      ButtonNext.tsx + style.css
  buttonScrollTop/ ButtonScrollTop.tsx + style.css
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (+ service worker) |
| `npm run preview` | Preview do build (teste PWA) |
| `npm run lint` | ESLint |

## Requisitos cobertos (v1)

| ID | Descrição |
| --- | --- |
| RF01 | Página inicial com o nome do projeto |
| RF02 | Seção Sobre |
| RF03 | Informações gerais da proposta |
| RF04–RF05 | Seção de serviços em cards |
| RF06 | Seção de processo simplificado |
| RF07–RF10 | Navegação por links, anterior, próxima e topo |
| RF11 | Interface responsiva |
| RF15 | Uso como PWA |
| RNF01 | React + TypeScript + Vite |
| RNF03–RNF04 | Responsivo e contraste adequado |
| RNF05 | Componentes em arquivos separados |
| RNF06–RNF09 | Scripts, PWA, navegação simples |
| RNF10 | Conteúdo extraído (`src/data/content.ts` + API) |

## Backend

API em: [PWA-project-X/backend](https://github.com/PWA-project-X/backend)
