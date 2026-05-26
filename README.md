# ChatCase Estudio de Fluxos

Fork do Design Studio usado pela plataforma ChatCase.

Este repositório contem a interface de construcao e configuracao de fluxos/chatbots integrada ao stack ChatCase/Tiledesk. Ele nao roda como produto isolado: o acesso normal acontece pelo deploy Docker do ChatCase, em `/cds/`, com autenticacao e contexto de projeto vindos do dashboard.

## Desenvolvimento

```bash
npm ci
npm run ng serve
```

O ambiente local de integracao usa o repositorio `chatcase-tiledesk-deploy`, que constrói este projeto pelo servico `cds`.

## Build Docker

```bash
docker compose -f ../chatcase-tiledesk-deploy/docker-compose.yml build cds
docker compose -f ../chatcase-tiledesk-deploy/docker-compose.yml up -d cds
```

Depois do build, o CDS fica disponivel em:

- `http://localhost:4502/`
- `http://localhost:8081/cds/`

## Notas ChatCase

- Branding, favicon e metadata usam assets locais em `src/assets/logos/`.
- A interface do CDS fica fixada em `pt`.
- O painel de blocos filtra acoes especificas de WABA quando o fluxo esta marcado como CaseZap.
- A imagem/video de ajuda bloqueada na tela de regras foi removida para evitar iframe bloqueado no proxy.
