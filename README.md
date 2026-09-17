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

O front usa `VITE_API_URL` (padrão `http://localhost:3001`) para buscar `/api/company` e `/api/services`. Se a API estiver indisponível, o conteúdo local em `src/data/content.ts` é usado automaticamente.

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

## Backend

API em: [PWA-project-X/backend](https://github.com/PWA-project-X/backend)
