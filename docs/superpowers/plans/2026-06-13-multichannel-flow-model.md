# Modelo Multicanal de Fluxos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restaurar o modelo de fluxos do ChatCase para ficar alinhado ao Tiledesk original: fluxos multicanais por padrao, com compatibilidade e fallback tratados por acao/no, nao por uma trava global automatica de canal.

**Architecture:** O dashboard e o Design Studio devem abrir bots como `all` quando nao houver escopo explicito (`exclusiveChannel` ou `isChannelExclusive`). Templates e importacoes podem ser filtrados por canal para preview/UX, mas nao devem persistir `targetChannel` em fluxos comuns. O runtime continua roteando por integracao/departamento/instancia; a validacao de incompatibilidade fica na acao especifica ou no publish.

**Tech Stack:** Angular legacy no `tiledesk-dashboard` e `chatcase-design-studio`; Node/Express no `tiledesk-server`; testes Mocha no `tiledesk-server`; validacao manual via VPS DEV `69.6.250.104:18081`.

---

## File Structure

- `C:/Users/enzo/tiledesk-dashboard/src/app/chatbot-design-studio/cds-dashboard/cds-dashboard.component.ts`
  - Responsavel por derivar `selectedChannel` a partir do bot carregado.
- `C:/Users/enzo/tiledesk-dashboard/src/app/chatbot-design-studio/cds-dashboard/cds-dashboard.component.html`
  - Responsavel por exibir badge de canal apenas quando o fluxo for explicitamente exclusivo.
- `C:/Users/enzo/tiledesk-dashboard/src/app/bots/templates/**/*.ts`
  - Responsavel por filtrar/visualizar templates por canal sem tornar o fluxo criado exclusivo por acidente.
- `C:/Users/enzo/tiledesk-server/pubmodules/chatbotTemplates/chatcaseTemplates.js`
  - Responsavel por normalizar templates e remover `targetChannel`/`selectedChannel` quando o template nao for exclusivo.
- `C:/Users/enzo/tiledesk-server/test/chatcaseTemplates.js`
  - Testes de contrato para multicanal por padrao e escopo exclusivo.
- `C:/Users/enzo/chatcase-design-studio/src/app/chatbot-design-studio/utils-actions.ts`
  - Responsavel por expor acoes gerais e especificas de canal no construtor sem esconder tudo por `selectedChannel`.

---

### Task 1: Confirmar contrato multicanal original

- [x] **Step 1: Verificar README original/local do Tiledesk**

Run:
```powershell
Select-String -Path C:\Users\enzo\tiledesk-server\README.md -Pattern "multichannel|auto-adapting|target channel" -Context 1,2
```

Expected: encontrar texto dizendo que scripts do chatbot rodam em todos os canais e se adaptam ao canal alvo.

- [x] **Step 2: Registrar decisao de produto**

Decision:
```text
Fluxo comum = multicanal.
Canal exclusivo = somente quando exclusiveChannel/isChannelExclusive for true.
Compatibilidade de WABA/CaseZap/Telegram/etc. = propriedade da acao ou template, nao do fluxo inteiro.
Fallback automatico = permitido somente para conversoes sem perda critica, como botoes simples para texto numerado.
Template WABA aprovado = exige fallback explicito ou bloqueio/aviso quando usado fora de WABA.
```

### Task 2: Garantir que o dashboard nao force CaseZap

- [x] **Step 1: Revisar derivacao de canal**

Run:
```powershell
Get-Content -Path C:\Users\enzo\tiledesk-dashboard\src\app\chatbot-design-studio\cds-dashboard\cds-dashboard.component.ts -TotalCount 330 | Select-Object -Skip 270
```

Expected: `selectedChannel` deve virar `all` se `exclusiveChannel`/`isChannelExclusive` nao estiverem true.

- [x] **Step 2: Revisar HTML do badge**

Run:
```powershell
Get-Content -Path C:\Users\enzo\tiledesk-dashboard\src\app\chatbot-design-studio\cds-dashboard\cds-dashboard.component.html -TotalCount 45
```

Expected: badge deve aparecer apenas com `selectedChannel !== 'all'` e texto deve indicar exclusividade, nao canal obrigatorio do fluxo.

- [x] **Step 3: Corrigir somente se necessario**

If the code still forces a channel, replace the derivation with:
```ts
private updateSelectedChannelFromBot(chatbot: any) {
  const attributes = chatbot && chatbot.attributes || {};
  const scopedChannel = this.normalizeTemplateChannel(attributes.targetChannel || attributes.selectedChannel);

  if (this.isExplicitChannelScope(attributes) && scopedChannel && scopedChannel !== 'all' && this.isKnownFlowChannel(scopedChannel)) {
    this.selectedChannel = scopedChannel;
    return;
  }

  this.selectedChannel = 'all';
}
```

### Task 3: Garantir que templates/importacoes nao persistam canal comum

- [x] **Step 1: Rodar teste de contrato do servidor**

Run:
```powershell
cd C:\Users\enzo\tiledesk-server
.\node_modules\.bin\mocha.cmd test\chatcaseTemplates.js --exit
```

Expected: todos os testes passam, incluindo `legacy targetChannel alone should not scope a multichannel template`.

- [x] **Step 2: Corrigir normalizacao se o teste falhar**

The desired invariant in `C:/Users/enzo/tiledesk-server/pubmodules/chatbotTemplates/chatcaseTemplates.js`:
```js
if (!isExplicitChannelScope(prepared.attributes)) {
  delete prepared.attributes.targetChannel;
  delete prepared.attributes.selectedChannel;
}
```

- [x] **Step 3: Confirmar que templates comuns suportam `all`**

Run:
```powershell
cd C:\Users\enzo\tiledesk-server
node -e "const t=require('./pubmodules/chatbotTemplates/chatcaseTemplates'); const tpl=t.getTemplatePayloadById(t.CHATCASE_TEMPLATE_IDS.WHATSAPP_MENU_BASIC); tpl.attributes.targetChannel='casezap'; tpl.attributes.selectedChannel='casezap'; console.log(t.getDefaultChannel(tpl));"
```

Expected:
```text
all
```

### Task 4: Garantir que o Design Studio mostre acoes multicanais

- [ ] **Step 1: Verificar filtros de acoes**

Run:
```powershell
rg -n "selectedChannel|targetChannel|casezap|waba|supportedChannels|chatbot_types" C:\Users\enzo\chatcase-design-studio\src\app\chatbot-design-studio -g "!node_modules" -g "!dist"
```

Expected: nao deve haver filtro que esconda acoes gerais so porque `selectedChannel` e `casezap`.

- [ ] **Step 2: Verificar no browser DEV**

Open:
```text
http://69.6.250.104:18081/cds/#/project/69ed3b00ea616400130956dc/chatbot/6a0bc45ab6f45f00130e22ef/blocks
```

Expected: ao abrir um fluxo comum, nao mostrar `Canal do fluxo: CaseZap`. A lista de acoes deve manter acoes gerais; acoes especificas podem aparecer agrupadas/rotuladas, mas nao travar o fluxo inteiro.

### Task 5: Publicar no DEV e validar CaseZap

- [ ] **Step 1: Commitar mudancas locais verificadas**

Run in each changed repo:
```powershell
git status --short
git add <changed-files>
git commit -m "Keep flows multichannel by default"
git push
```

Expected: commit inclui somente arquivos ligados ao modelo multicanal de fluxo.

- [ ] **Step 2: Atualizar VPS DEV**

Run on DEV:
```bash
ssh root@69.6.250.104 -p 22022
cd /opt/chatcase/chatcase-tiledesk-deploy
git pull
docker compose up -d --build
```

Expected: containers sobem sem afetar outros servicos.

- [ ] **Step 3: Testar Lovtok e markus-chatcase**

Manual/browser/API test:
```text
1. Abrir http://69.6.250.104:18081/dashboard/#/project/69ed3b00ea616400130956dc/integrations?name=casezap
2. Confirmar Lovtok e markus-chatcase conectados.
3. Enviar mensagem entre os dois numeros.
4. Abrir http://69.6.250.104:18081/chat/#/conversation-detail/
5. Confirmar que a conversa aparece e que o fluxo multicanal responde quando habilitado.
6. Desabilitar o fluxo usado no teste se ele foi habilitado apenas para validacao.
```

Expected: CaseZap continua funcionando sem exigir que o fluxo inteiro seja exclusivo de CaseZap.

---

## Self-Review

- Spec coverage: o plano cobre a proposta original multicanal, a remocao de canal global automatico, a preservacao de canal exclusivo explicito, a compatibilidade por no/template e o teste com Lovtok/markus-chatcase.
- Placeholder scan: nao ha `TBD`, `TODO` ou instrucoes sem comando de verificacao.
- Type consistency: `targetChannel`, `selectedChannel`, `exclusiveChannel`, `isChannelExclusive` e `selectedChannel='all'` foram usados consistentemente nos arquivos Angular/Node existentes.
