# Frontend — PWA Project X

Aplicação web dinâmica com **React + TypeScript + Vite** e suporte a **PWA** (`vite-plugin-pwa`), conforme a disciplina de Programação Avançada para Web.

## Pré-requisitos

- Node.js
- npm

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## PWA (produção / preview)

Para ver a instalação e o funcionamento offline:

```bash
npm run build
npm run preview
```

## Estrutura de componentes

Cada componente fica em sua pasta com o arquivo do componente e o CSS separado:

```
src/components/
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
