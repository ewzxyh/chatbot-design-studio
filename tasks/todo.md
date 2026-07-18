# Organizar fluxo

- [x] Auditar canvas, conectores, persistencia e historico existentes.
- [x] Implementar e testar o motor hierarquico de layout.
- [ ] Integrar o comando ao canvas e a barra de ferramentas.
- [ ] Persistir todas as posicoes em uma unica operacao com undo/redo unico.
- [ ] Atualizar conectores e informar blocos fora do fluxo principal.
- [ ] Validar build e testes.

## Criterios de aceite

- O fluxo principal parte do bloco `start` e nao sobrepoe blocos.
- Blocos fora do componente principal ficam em uma area separada.
- Uma organizacao gera uma unica entrada no historico e uma unica requisicao de persistencia.
- Desfazer e refazer restauram todas as posicoes da organizacao.
- Os conectores acompanham os blocos sem alterar a logica do fluxo.

## Revisao

Pendente.
