# Organizar fluxo

- [x] Auditar canvas, conectores, persistencia e historico existentes.
- [x] Implementar e testar o motor hierarquico de layout.
- [x] Integrar o comando ao canvas e a barra de ferramentas.
- [x] Persistir todas as posicoes em uma unica operacao com undo/redo unico.
- [x] Atualizar conectores e informar blocos fora do fluxo principal.
- [x] Validar build e testes.

## Criterios de aceite

- O fluxo principal parte do bloco `start` e nao sobrepoe blocos.
- Blocos fora do componente principal ficam em uma area separada.
- Uma organizacao gera uma unica entrada no historico e uma unica requisicao de persistencia.
- Desfazer e refazer restauram todas as posicoes da organizacao.
- Os conectores acompanham os blocos sem alterar a logica do fluxo.

## Revisao

- `npm run build`: concluido sem erros; permanecem apenas avisos legados de budget SCSS e Firebase CommonJS.
- Motor Dagre validado isoladamente com fluxo principal, bloco orfao, contagem de desconectados e ausencia de sobreposicao.
- A execucao segmentada pelo Karma continua impedida por specs legadas globais que o Angular compila mesmo com `--include`.
