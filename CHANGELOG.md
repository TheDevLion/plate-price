# Changelog

## Não lançado

- O campo de produto dos ingredientes agora permite buscar pelo nome, no celular e no desktop.
- O seletor de unidades agora permite digitar para buscar por nome ou sigla, mantendo o filtro por categoria e a seleção de unidades válidas.

## 0.1.0 — preparação local

Primeira versão numerada do Plate Price. Base anterior: `0.0.0`, sem releases ou tags existentes na consulta ao remoto. Esta versão ainda não foi publicada.

### Interface

- Seletor de unidades sem digitação, com grupos, seta visível, navegação por teclado e menu adaptado à tela.
- Campos maiores, foco visível, rótulos acessíveis e ações de exclusão identificadas.
- Produtos apresentados em tabela no desktop e em blocos no celular, com cabeçalho e rodapé do diálogo sempre acessíveis.
- Ingredientes com mais espaço para quantidade e unidade no celular, além de custo total em destaque.
- Textos de confirmação e rótulos em português revisados.

### Correções

- A edição de uma ficha preenche seu nome atual, rejeita nomes em branco e permite confirmar com Enter.
- Excluir uma ficha seleciona a próxima disponível ou limpa a seleção.
- Alterações em produtos ficam em um rascunho até salvar. Fechar com alterações pede confirmação para descartá-las.
- Salvar produtos atualiza os dados e fecha o diálogo. Falhas de armazenamento mantêm o rascunho aberto e mostram um erro.
- Trocar o produto de um ingrediente atualiza a unidade e limpa o preço anterior. Um único preço disponível é selecionado automaticamente.
- Ingredientes e totais acompanham as mudanças do estado compartilhado sem depender de trocar a ficha.

### Compatibilidade

O formato dos dados salvos e dos links compartilhados permanece igual. Nenhuma migração manual ou dependência nova é necessária.
