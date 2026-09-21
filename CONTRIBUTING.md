# Guia de contribuição — Frontend

Portfólio Interno Miniverso ([PWA-project-X/frontend](https://github.com/PWA-project-X/frontend)).

## Branching

Crie branches a partir de `main`:

| Prefixo | Uso |
| --- | --- |
| `feat/` | Nova funcionalidade ou seção |
| `fix/` | Correção de bug |
| `docs/` | Documentação |
| `chore/` | Manutenção, CI, deps |

Exemplos: `feat/insights-section`, `fix/header-active-link`, `docs/traceability`.

## Commits

- Mensagens claras (português ou inglês — mantenha o estilo do histórico do repo).
- Um assunto por commit quando possível; PRs pequenos facilitam review.

## Pull requests

1. Abra PR contra `main` usando o template.
2. Preencha IDs RF/RNF tocados (ver [`docs/TRACEABILITY.md`](docs/TRACEABILITY.md)).
3. Aguarde CI verde (`lint` + `build`).
4. Preferência: **squash merge** após 1 aprovação do tech lead.

### Definition of Ready

- Issue ou descrição clara do objetivo.
- Escopo alinhado ao PDF (nada de admin/DB/auth na v1).
- Como testar definido.

### Definition of Done

- [ ] `npm run lint` passa
- [ ] `npm run build` passa
- [ ] Critérios de [`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md) relevantes validados localmente
- [ ] README / TRACEABILITY atualizados se houver requisito novo
- [ ] Sem secrets (`.env`) no commit

## Ambiente local

```bash
cp .env.example .env
npm install
npm run dev
```

Para API + front juntos, use a pasta de orquestração local `PWA/` (`npm run dev` na raiz).

## Higiene de branches

Branches remotas obsoletas (`devlop`, `feat/*` já mergeadas) só devem ser apagadas após confirmação do tech lead.
