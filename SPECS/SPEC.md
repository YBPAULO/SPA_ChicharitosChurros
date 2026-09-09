## Contexto

Aplicação SPA com stack ****HTML, CSS, JS puro****, sem pacotes ou dependências, hospedada no ****GitHub Pages****. O app é um cardápio estilo "lanchonete".

## Requisitos técnicos globais

-   App deve rodar em ****contexto seguro (HTTPS)**** — obrigatório para `Geolocation` e `CredentialsContainer` (WebAuthn). GitHub Pages atende esse requisito.
-   Geolocalização: tratar ****recusa de permissão**** graciosamente — não bloquear o checkout se o usuário negar.
-   CredentialsContainer: o prompt nativo exige ****gesto do usuário**** — botão "Confirmar com biometria" deve ser explícito na tela.
-   Tentar `navigator.credentials.create()` com `authenticatorSelection: { authenticatorAttachment: "platform" }`.
-   Em caso de `NotAllowedError` / `NotSupportedError` (dispositivo sem biometria/PIN), oferecer ****fallback****: `PasswordCredential` via `navigator.credentials.store()`, ou registrar "verificação indisponível neste dispositivo" e seguir o fluxo.
-   É prova de vida simulada (sem backend para validar assinatura da credencial).

## Recursos do App

1.  Carregar dados do cardápio a partir de **`**menu.json**`** (estrutura estática, gerada por IA), organizado por categoria → produto → opcionais pré-definidos com preço adicional.
2.  Primeira tela já exibe a lista de produtos. ****Sem cadastro**** até o checkout.
3.  Carrinho persistido em ****localStorage****:

-   Chave versionada: `churros_cart_v1`.
-   Schema do item: `{ productId, name, unitPrice, qty, optionals: [{ name, price }], notes }`.

4.  No checkout, usuário se cadastra (nome, WhatsApp, email, endereço) e ****adiciona a localização (Geolocation)****.
5.  Após cadastro, pedir credenciais do dispositivo (****CredentialsContainer****) como camada extra de segurança/prova de vida.
6.  Após validar as credenciais, ****simular um gateway de pagamento genérico**** (modal com estados: processando → aprovado).
7.  Gerar link para o WhatsApp: `https://wa.me/5511942142986?text=<pedido formatado>` com `encodeURIComponent`.

## O que o aplicativo NÃO deve fazer

1.  Processar pagamento — apenas simulação.
2.  Cadastrar produtos — dados vêm de `menu.json`.
3.  Controlar delivery.
4.  Controle de estoque.
5.  Calcular frete.

## Fluxo de telas (hash routing)

1.  `/#/` — catálogo (cards de produto + modal de opcionais)
2.  `/#/cart` — carrinho (editar quantidades, persistir em localStorage)
3.  `/#/checkout` — cadastro (nome, WhatsApp, email, endereço) + botão de geolocalização
4.  `/#/verify` — CredentialsContainer
5.  `/#/payment` → confirmação + link WhatsApp

JSON Exemplo
-

    { "store": { "name": "Churros da Vila", "currency": "BRL", "whatsapp": "+5511942142986" }, "categories": [ { "id": "churros-classicos", "name": "Churros Clássicos", "products": [ { "id": "ch-classico", "name": "Churro Clássico", "description": "Churro tradicional com açúcar e canela", "basePrice": 6.0, "image": "assets/img/churro-classico.jpg" }, { "id": "ch-doce-leite", "name": "Churro de Doce de Leite", "description": "Recheado com doce de leite cremoso", "basePrice": 8.0, "image": "assets/img/churro-doce-de-leite.jpg" }, { "id": "ch-chocolate", "name": "Churro de Chocolate", "description": "Recheado com chocolate ao leite", "basePrice": 8.0, "image": "assets/img/churro-chocolate.jpg" }, { "id": "ch-romeu-julieta", "name": "Romeu e Julieta", "description": "Recheado com queijo minas e goiabada", "basePrice": 9.0, "image": "assets/img/churro-romeu-julieta.jpg" } ] }, { "id": "churros-especiais", "name": "Churros Especiais", "products": [ { "id": "ch-nutella", "name": "Churro de Nutella", "description": "Recheado com Nutella", "basePrice": 12.0, "image": "assets/img/churro-nutella.jpg" }, { "id": "ch-oreo", "name": "Churro Oreo", "description": "Recheado com creme de Oreo", "basePrice": 11.0, "image": "assets/img/churro-oreo.jpg" }, { "id": "ch-kitkat", "name": "Churro KitKat", "description": "Chocolate KitKat com recheio de chocolate", "basePrice": 12.0, "image": "assets/img/churro-kitkat.jpg" }, { "id": "ch-prestigio", "name": "Churro Prestígio", "description": "Chocolate e coco — sabor Prestígio", "basePrice": 10.0, "image": "assets/img/churro-prestigio.jpg" } ] }, { "id": "combos", "name": "Combos", "products": [ { "id": "combo-casal", "name": "Combo Casal", "description": "4 churros clássicos + 2 especiais à escolha", "basePrice": 32.0, "image": "assets/img/combo-casal.jpg" }, { "id": "combo-familia", "name": "Combo Família", "description": "6 churros clássicos + 4 especiais à escolha", "basePrice": 55.0, "image": "assets/img/combo-familia.jpg" }, { "id": "combo-mini", "name": "Combo Mini (10 un.)", "description": "10 mini churros tradicionais", "basePrice": 20.0, "image": "assets/img/combo-mini.jpg" } ] }, { "id": "bebidas", "name": "Bebidas", "products": [ { "id": "beb-agua", "name": "Água Mineral", "description": "500ml, sem gás", "basePrice": 4.0, "image": "assets/img/agua.jpg" }, { "id": "beb-refrigerante", "name": "Refrigerante Lata", "description": "350ml — Coca-Cola, Guaraná ou Fanta", "basePrice": 6.0, "image": "assets/img/refrigerante.jpg" }, { "id": "beb-suco", "name": "Suco Natural", "description": "Laranja ou maracujá, 500ml", "basePrice": 9.0, "image": "assets/img/suco.jpg" }, { "id": "beb-cafe", "name": "Café Expresso", "description": "Perfeito para acompanhar o churro", "basePrice": 5.0, "image": "assets/img/cafe.jpg" } ] } ], "optionals": [ { "id": "op-morango", "name": "Morango", "price": 2.0 }, { "id": "op-granulado", "name": "Granulado", "price": 1.0 }, { "id": "op-pacoca", "name": "Paçoca", "price": 1.5 }, { "id": "op-chantilly", "name": "Chantilly", "price": 2.0 }, { "id": "op-leite-condensado", "name": "Leite Ninho", "price": 2.5 }, { "id": "op-nutella-extra", "name": "Nutella Extra", "price": 4.0 } ] }

UI/UX
-
1. Utilize a paleta de cores:  
-   🍫  **Marrom chocolate:**  #5A3825
-   🍮  **Caramelo:**  #B8793E
-   🤍  **Bege:**  #D8C3A5
-   🕊️  **Off-white:**  #F5F1E8
-   🥛  **Creme:**  #F2E6D0
2. Utilize o Coogle Fonts Figtree para titulos e Roboto Slab para textos corridos. E aplique versões condensadas das fontes quando conveniente.
3. **Não utilize emojis**. Utilize Google Icons.
4. Interface minimalista. Com fundo Off-white.
5. Adicione pequenas aniações em botões e transições de telas. 

