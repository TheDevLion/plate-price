# Atividade: uso completo no celular

## Objetivo

Adaptar a tela inteira para celular sem alterar a apresentação desktop aprovada. Preservar busca por produto/unidade, dados, cálculos, identidade visual e dependências.

## Direção

Pessoa e tarefa: preencher fichas técnicas e preços de compra com uma mão, inclusive em telas curtas.
Domínio: receitas, embalagens, quantidades, unidades, fornecedores e custo por ingrediente.
Paleta preservada: uva, lavanda, branco, tinta e vermelho de exclusão. Superfícies brancas, bordas leves e menus elevados.
Assinatura: produto, medida e preço ligados ao custo da ficha.
Evitar: cabeçalho ocupando metade da tela, ações quebrando de linha sem ordem e descrições comprimidas entre preço e lixeira.

Cabeçalho: acesso à ficha e às ações em linhas previsíveis; título e seletor como foco.
Resumo/cards: quantidade e custo legíveis; ações com área de toque de 44px.
Produtos/diálogos: formulário ocupa a tela pequena, conteúdo rola entre cabeçalho e rodapé; salvar permanece acessível.
Campos/menus: texto digitável de 16px no celular, espaço reservado para ícones, opções dentro da área visível.
Tipografia e espaçamento: família existente, títulos de 20px, rótulos de 12px, base de 4px e grupos de 12–16px.

## Aceite

- [x] Sem overflow ou ações cortadas em 320–430px, paisagem e altura reduzida.
- [x] Criar/editar/excluir fichas, buscar ingredientes e editar/salvar produtos continuam funcionando.
- [x] Nomes e descrições longos permanecem editáveis; números e avisos cabem nos controles.
- [x] Navegação por toque e teclado, foco e rolagem dos diálogos verificados.
- [x] Desktop comparado visualmente com a base antes da alteração.
- [x] Testes, lint, build e diff verificados.

## Base e estado

Base: `488302d`, working tree inicialmente limpo. Implementação e validação local concluídas.

## Evidências

- 24 testes passaram, incluindo foco no produto/preço recém-adicionado sem alterar o estado salvo. `pnpm lint`, `pnpm build` e `git diff --check` passaram.
- Chrome isolado com toque em 320×568, 360×640, 390×844, 430×932, 844×390, 390×360, 768×1024 e 1024×768: controles e menus dentro da largura, diálogos dentro da altura e ações acessíveis.
- Fluxos completos em 320×568, 844×390 e 390×360: busca/seleção/limpeza, adicionar produto e preço, salvar com persistência, cancelar e descartar rascunho, criar/renomear/excluir ficha e adicionar/excluir ingrediente.
- Estados vazios, inglês, ausência de suporte a fullscreen, exclusão de preço/produto, nomes sem espaços e totais grandes verificados em 320px. Nenhum erro JavaScript nos oito cenários de tamanho.
- Capturas desktop em 1440×1000: página principal e renomeação idênticas pixel a pixel. Editor mantém dimensões e disposição; pequenas diferenças de rasterização nos campos (566 pixels de uma captura de 1.572.480 pixels).
- Nenhuma dependência, migração de dados ou nova versão. Changelog atualizado em “Não lançado”. Commits separados por página mobile, editor de produtos, campos/diálogos e registro da atividade.

Limite: testes em emulação Chrome, sem aparelho físico ou teclado virtual real; 390×360 simula apenas a redução da área disponível. Publicação usa o workflow existente `deploy.yml`, acionado pelo push em `master`; o resultado remoto será conferido após o envio.
