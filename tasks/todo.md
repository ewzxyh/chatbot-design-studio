# Organizar fluxo

- [x] Auditar canvas, conectores, persistencia e historico existentes.
- [x] Implementar e testar o motor hierarquico de layout.
- [x] Integrar o comando ao canvas e a barra de ferramentas.
- [x] Persistir todas as posicoes em uma unica operacao com undo/redo unico.
- [x] Atualizar conectores e informar blocos fora do fluxo principal.
- [x] Validar build e testes.
- [x] Organizar blocos desconectados em grid adaptativo a direita do fluxo.
- [x] Preservar o arraste dos blocos depois da organizacao.
- [x] Normalizar o zoom por roda e limitar saltos de escala.

## Criterios de aceite

- O fluxo principal parte do bloco `start` e nao sobrepoe blocos.
- Blocos fora do componente principal ficam em uma area separada.
- O grid de blocos desconectados usa ate seis linhas e cresce em colunas para a direita.
- Os blocos permanecem arrastaveis imediatamente apos organizar.
- Uma organizacao gera uma unica entrada no historico e uma unica requisicao de persistencia.
- Desfazer e refazer restauram todas as posicoes da organizacao.
- Os conectores acompanham os blocos sem alterar a logica do fluxo.

## Revisao

- O fluxo conectado continua usando Dagre; somente os blocos fora do fluxo principal usam o grid.
- O grid cresce por colunas e limita a altura a seis linhas.
- O `trackBy` por `intent_id` preserva os elementos DOM e seus handlers de arraste apos atualizar as posicoes.
- Build de producao aprovado. O Karma direcionado permanece bloqueado por specs legados globais nao relacionados.
- `npm run build`: concluido sem erros; permanecem apenas avisos legados de budget SCSS e Firebase CommonJS.
- Motor Dagre validado isoladamente com fluxo principal, bloco orfao, contagem de desconectados e ausencia de sobreposicao.
- A execucao segmentada pelo Karma continua impedida por specs legadas globais que o Angular compila mesmo com `--include`.
- O zoom pela roda limita cada evento a `0.1`, mantendo deltas menores de touchpad proporcionais.
