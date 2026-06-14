# Plano: compatibilidade de ações por canal em fluxos multicanal

## Contexto

O fluxo deve continuar multicanal por padrão, seguindo o comportamento esperado do Tiledesk: o mesmo bot pode atender canais diferentes, e o roteamento do canal/numero deve ser configurado no departamento ou integração. A distinção no editor deve ocorrer no nível da ação, porque alguns nós são nativos apenas para WABA/WhatsApp Business.

## Decisão

1. Não marcar todo fluxo como CaseZap ou WABA automaticamente.
2. Usar departamento com `channel_bindings` para definir qual instância/numero usa qual fluxo.
3. Classificar ações específicas por compatibilidade:
   - `native`: funciona nativamente no canal.
   - `fallback`: pode virar mensagem de texto sem perder o sentido principal.
   - `review_required`: precisa de revisão/configuração manual antes de publicar para outro canal.
4. Mostrar no Design Studio um selo discreto nas ações WABA-específicas, sem esconder a ação.

## Execução

- [x] Adicionar testes de contrato no servidor para compatibilidade/fallback de ações.
- [x] Implementar helpers puros para classificar e gerar fallback textual quando seguro.
- [x] Marcar ações WABA-específicas no Design Studio com badge/tooltip de compatibilidade.
- [x] Rodar testes automatizados do servidor e validação de build/compilação viável no Design Studio.
- [ ] Publicar na VPS DEV e validar visualmente o editor/fluxo.

## Critério de pronto

Um fluxo novo/importado continua multicanal por padrão, o usuário vê avisos apenas nos nós específicos de WABA, e o servidor consegue dizer se uma ação é nativa, tem fallback textual seguro, ou exige revisão.
