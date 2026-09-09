/**
 * Chicharitos Artisanal Churros - SPA Main Application
 */

const CART_STORAGE_KEY = 'churros_cart_v1';
const CHECKOUT_STORAGE_KEY = 'churros_checkout_v1';

// Application State
const state = {
  menu: null,
  cart: [],
  checkoutData: {
    name: '',
    whatsapp: '',
    email: '',
    address: '',
    geolocation: null
  },
  selectedCategory: 'all',
  currentModalProduct: null,
  modalOptionalsSelected: [],
  modalQty: 1,
  modalNotes: ''
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  loadCheckoutFromStorage();
  fetchMenuData().then(() => {
    initRouter();
  });

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
});

// Fetch menu.json
async function fetchMenuData() {
  try {
    const res = await fetch('menu.json');
    state.menu = await res.json();
    updateCartHeaderBadge();
  } catch (err) {
    console.error('Erro ao carregar menu.json', err);
    showToast('Erro ao carregar cardápio.');
  }
}

// Router
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const main = document.getElementById('mainContent');

  if (hash === '#/' || hash === '') {
    renderCatalogView(main);
  } else if (hash === '#/cart') {
    renderCartView(main);
  } else if (hash === '#/checkout') {
    renderCheckoutView(main);
  } else if (hash === '#/verify') {
    renderVerifyView(main);
  } else if (hash === '#/payment') {
    renderPaymentView(main);
  } else {
    window.location.hash = '#/';
  }

  window.scrollTo(0, 0);
}

// LocalStorage helpers
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) state.cart = JSON.parse(raw);
  } catch (e) {
    state.cart = [];
  }
}

function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  updateCartHeaderBadge();
}

function loadCheckoutFromStorage() {
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (raw) state.checkoutData = JSON.parse(raw);
  } catch (e) {}
}

function saveCheckoutToStorage() {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(state.checkoutData));
}

function updateCartHeaderBadge() {
  const badge = document.getElementById('cartBadge');
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) {
    badge.textContent = totalQty;
  }
}

function calculateCartTotal() {
  return state.cart.reduce((sum, item) => {
    const optionalsCost = (item.optionals || []).reduce((optSum, opt) => optSum + opt.price, 0);
    return sum + (item.unitPrice + optionalsCost) * item.qty;
  }, 0);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/* ==========================================================================
   VIEW 1: CATALOG (#/)
   ========================================================================== */
function renderCatalogView(container) {
  if (!state.menu) return;

  const categories = state.menu.categories;

  let html = `
    <div class="catalog-view">
      <div class="page-title">
        <span class="material-symbols-outlined logo-icon">restaurant_menu</span>
        <span>Nosso Cardápio</span>
      </div>

      <!-- Categories Scroll -->
      <div class="categories-scroll">
        <button class="chip-btn ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">
          <span class="material-symbols-outlined" style="font-size:16px;">apps</span>
          Todos
        </button>
        ${categories.map(cat => `
          <button class="chip-btn ${state.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            ${cat.name}
          </button>
        `).join('')}
      </div>

      <!-- Product List -->
      <div class="products-grid" id="productsGrid">
  `;

  let visibleProducts = [];
  categories.forEach(cat => {
    if (state.selectedCategory === 'all' || state.selectedCategory === cat.id) {
      cat.products.forEach(prod => visibleProducts.push(prod));
    }
  });

  visibleProducts.forEach(prod => {
    html += `
      <div class="product-card" data-prod-id="${prod.id}">
        <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23F2E6D0\'><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%235A3825\'>Churros</text></svg>'" />
        <div class="product-info">
          <div>
            <div class="product-title">${prod.name}</div>
            <div class="product-desc">${prod.description}</div>
          </div>
          <div class="product-footer">
            <span class="product-price">R$ ${prod.basePrice.toFixed(2).replace('.', ',')}</span>
            <button class="btn-add open-modal-btn" data-prod-id="${prod.id}">
              <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;

  // Sticky Tray se houver itens no carrinho
  if (state.cart.length > 0) {
    const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
    const cartTotal = calculateCartTotal();
    html += `
      <div class="sticky-bottom-bar">
        <div class="tray-info">
          <span class="tray-count">${cartCount} ${cartCount === 1 ? 'item' : 'itens'} no carrinho</span>
          <span class="tray-total">R$ ${cartTotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <a href="#/cart" class="tray-btn">
          Ver Carrinho
          <span class="material-symbols-outlined" style="font-size:18px;">arrow_forward</span>
        </a>
      </div>
    `;
  }

  container.innerHTML = html;

  // Category filter handlers
  container.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedCategory = e.currentTarget.getAttribute('data-cat');
      renderCatalogView(container);
    });
  });

  // Open modal handlers
  container.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = e.currentTarget.getAttribute('data-prod-id');
      openProductModal(prodId);
    });
  });
}

// Product Optionals Modal
function openProductModal(productId) {
  let foundProd = null;
  state.menu.categories.forEach(cat => {
    const p = cat.products.find(item => item.id === productId);
    if (p) foundProd = p;
  });

  if (!foundProd) return;

  state.currentModalProduct = foundProd;
  state.modalOptionalsSelected = [];
  state.modalQty = 1;
  state.modalNotes = '';

  renderModalContent();
  document.getElementById('productModal').classList.remove('hidden');
}

function renderModalContent() {
  const prod = state.currentModalProduct;
  const optionals = state.menu.optionals || [];

  const modalBody = document.getElementById('modalBody');

  let optionalsHtml = optionals.map(opt => {
    const isSelected = state.modalOptionalsSelected.some(o => o.id === opt.id);
    return `
      <label class="optional-item" data-opt-id="${opt.id}">
        <div class="optional-info">
          <input type="checkbox" class="optional-checkbox" ${isSelected ? 'checked' : ''} />
          <span class="optional-name">${opt.name}</span>
        </div>
        <span class="optional-price">+ R$ ${opt.price.toFixed(2).replace('.', ',')}</span>
      </label>
    `;
  }).join('');

  const unitTotal = prod.basePrice + state.modalOptionalsSelected.reduce((s, o) => s + o.price, 0);
  const grandTotal = unitTotal * state.modalQty;

  modalBody.innerHTML = `
    <div class="modal-product-header">
      <div class="modal-product-title">${prod.name}</div>
      <div class="modal-product-price">R$ ${prod.basePrice.toFixed(2).replace('.', ',')}</div>
      <p style="font-size:13px; color:var(--color-on-surface-variant); margin-top:4px;">${prod.description}</p>
    </div>

    <div class="section-label">Opcionais Extra</div>
    <div class="optionals-list">
      ${optionalsHtml}
    </div>

    <div class="section-label">Observações</div>
    <textarea id="modalNotesInput" class="notes-input" rows="2" placeholder="Ex: Pouca canela, bem recheado...">${state.modalNotes}</textarea>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:20px; gap:12px;">
      <div class="quantity-stepper">
        <button class="stepper-btn" id="modalMinusBtn">
          <span class="material-symbols-outlined" style="font-size: 18px;">remove</span>
        </button>
        <span class="stepper-val">${state.modalQty}</span>
        <button class="stepper-btn" id="modalPlusBtn">
          <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
        </button>
      </div>

      <button class="btn-primary" id="confirmAddToCartBtn" style="flex:1;">
        Adicionar • R$ ${grandTotal.toFixed(2).replace('.', ',')}
      </button>
    </div>
  `;

  // Attach modal listeners
  modalBody.querySelectorAll('.optional-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const optId = item.getAttribute('data-opt-id');
      const opt = optionals.find(o => o.id === optId);

      const existingIndex = state.modalOptionalsSelected.findIndex(o => o.id === optId);
      if (existingIndex > -1) {
        state.modalOptionalsSelected.splice(existingIndex, 1);
      } else {
        state.modalOptionalsSelected.push(opt);
      }
      renderModalContent();
    });
  });

  const notesInput = document.getElementById('modalNotesInput');
  notesInput.addEventListener('input', (e) => {
    state.modalNotes = e.target.value;
  });

  document.getElementById('modalMinusBtn').addEventListener('click', () => {
    if (state.modalQty > 1) {
      state.modalQty--;
      renderModalContent();
    }
  });

  document.getElementById('modalPlusBtn').addEventListener('click', () => {
    state.modalQty++;
    renderModalContent();
  });

  document.getElementById('confirmAddToCartBtn').addEventListener('click', addItemToCart);
}

function addItemToCart() {
  const item = {
    productId: state.currentModalProduct.id,
    name: state.currentModalProduct.name,
    unitPrice: state.currentModalProduct.basePrice,
    qty: state.modalQty,
    optionals: [...state.modalOptionalsSelected],
    notes: state.modalNotes
  };

  state.cart.push(item);
  saveCartToStorage();
  closeModal();
  showToast(`${item.name} adicionado ao carrinho!`);

  // Refresh catalog view if on catalog
  if (window.location.hash === '#/' || window.location.hash === '') {
    renderCatalogView(document.getElementById('mainContent'));
  }
}

function closeModal() {
  document.getElementById('productModal').classList.add('hidden');
}

/* ==========================================================================
   VIEW 2: CART (#/cart)
   ========================================================================== */
function renderCartView(container) {
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 16px;">
        <span class="material-symbols-outlined" style="font-size: 64px; color: var(--color-caramelo); margin-bottom: 12px;">shopping_cart</span>
        <h2 style="font-size:20px; font-weight:800; margin-bottom:8px;">Seu carrinho está vazio</h2>
        <p style="font-size:14px; color: var(--color-on-surface-variant); margin-bottom:24px;">Que tal adicionar alguns churros crocantes para adoçar seu dia?</p>
        <a href="#/" class="btn-primary" style="display:inline-flex; width:auto; padding: 0 24px;">Ver Cardápio</a>
      </div>
    `;
    return;
  }

  let itemsHtml = state.cart.map((item, index) => {
    const optionalsText = item.optionals && item.optionals.length > 0
      ? item.optionals.map(o => `+ ${o.name} (R$ ${o.price.toFixed(2).replace('.', ',')})`).join('<br/>')
      : '';

    const optionalsCost = (item.optionals || []).reduce((s, o) => s + o.price, 0);
    const itemSubtotal = (item.unitPrice + optionalsCost) * item.qty;

    return `
      <div class="product-card" style="flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="product-title">${item.name}</div>
            ${optionalsText ? `<div style="font-size:12px; color:var(--color-caramelo); margin-top:2px;">${optionalsText}</div>` : ''}
            ${item.notes ? `<div style="font-size:12px; font-style:italic; color:var(--color-on-surface-variant); margin-top:2px;">Obs: ${item.notes}</div>` : ''}
          </div>
          <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; color:var(--color-error); cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:20px;">delete</span>
          </button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div class="quantity-stepper">
            <button class="stepper-btn cart-qty-minus" data-index="${index}">
              <span class="material-symbols-outlined" style="font-size: 16px;">remove</span>
            </button>
            <span class="stepper-val">${item.qty}</span>
            <button class="stepper-btn cart-qty-plus" data-index="${index}">
              <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
            </button>
          </div>
          <span class="product-price">R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    `;
  }).join('');

  const total = calculateCartTotal();

  container.innerHTML = `
    <div class="cart-view">
      <div class="page-title">
        <span class="material-symbols-outlined logo-icon">shopping_cart</span>
        <span>Seu Carrinho</span>
      </div>

      <div class="products-grid" style="margin-bottom: 24px;">
        ${itemsHtml}
      </div>

      <div class="step-card" style="text-align:left; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
          <span>Subtotal</span>
          <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
          <span>Taxa de Entrega</span>
          <span style="color:var(--color-success); font-weight:700;">Grátis</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--color-bege); padding-top:12px; font-family:var(--font-heading); font-weight:800; font-size:18px;">
          <span>Total</span>
          <span style="color:var(--color-caramelo);">R$ ${total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <a href="#/checkout" class="btn-primary">
          Avançar para o Cadastro
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
        <a href="#/" class="btn-outline">
          Continuar Comprando
        </a>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll('.cart-qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      if (state.cart[idx].qty > 1) {
        state.cart[idx].qty--;
      } else {
        state.cart.splice(idx, 1);
      }
      saveCartToStorage();
      renderCartView(container);
    });
  });

  container.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      state.cart[idx].qty++;
      saveCartToStorage();
      renderCartView(container);
    });
  });

  container.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      state.cart.splice(idx, 1);
      saveCartToStorage();
      renderCartView(container);
    });
  });
}

/* ==========================================================================
   VIEW 3: CHECKOUT (#/checkout)
   ========================================================================== */
function renderCheckoutView(container) {
  if (state.cart.length === 0) {
    window.location.hash = '#/';
    return;
  }

  const data = state.checkoutData;

  container.innerHTML = `
    <div class="checkout-view">
      <div class="page-title">
        <span class="material-symbols-outlined logo-icon">person</span>
        <span>Cadastro & Entrega</span>
      </div>

      <form id="checkoutForm" class="step-card" style="text-align:left;">
        <div class="form-group">
          <label class="form-label" for="inputName">Nome Completo *</label>
          <input type="text" id="inputName" class="form-input" required value="${data.name || ''}" placeholder="Ex: Maria Silva" />
        </div>

        <div class="form-group">
          <label class="form-label" for="inputWhatsapp">WhatsApp *</label>
          <input type="tel" id="inputWhatsapp" class="form-input" required value="${data.whatsapp || ''}" placeholder="Ex: (11) 99999-9999" />
        </div>

        <div class="form-group">
          <label class="form-label" for="inputEmail">E-mail *</label>
          <input type="email" id="inputEmail" class="form-input" required value="${data.email || ''}" placeholder="Ex: maria@email.com" />
        </div>

        <div class="form-group">
          <label class="form-label" for="inputAddress">Endereço Completo de Entrega *</label>
          <input type="text" id="inputAddress" class="form-input" required value="${data.address || ''}" placeholder="Rua, Número, Bairro, Complemento" />
        </div>

        <div class="form-group" style="margin-top:20px;">
          <label class="form-label">Localização Exata (Geolocalização)</label>
          <p style="font-size:12px; color:var(--color-on-surface-variant); margin-bottom:8px;">
            Ajuda nosso entregador a encontrar seu endereço mais rapidamente.
          </p>
          <button type="button" id="geoBtn" class="btn-outline" style="height:42px; font-size:13px;">
            <span class="material-symbols-outlined">location_on</span>
            <span id="geoBtnText">${data.geolocation ? 'Localização Capturada ✓' : 'Adicionar Minha Localização'}</span>
          </button>
          <div id="geoStatus" style="font-size:12px; margin-top:6px; color:var(--color-success); font-weight:600;">
            ${data.geolocation ? `Lat: ${data.geolocation.latitude.toFixed(4)}, Lng: ${data.geolocation.longitude.toFixed(4)}` : ''}
          </div>
        </div>

        <button type="submit" class="btn-primary" style="margin-top:24px;">
          Ir para Verificação Biométrica
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </form>
    </div>
  `;

  const geoBtn = document.getElementById('geoBtn');
  const geoStatus = document.getElementById('geoStatus');
  const geoBtnText = document.getElementById('geoBtnText');

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não suportada no seu navegador.');
      return;
    }

    geoBtnText.textContent = 'Obtendo localização...';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.checkoutData.geolocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        saveCheckoutToStorage();
        geoBtnText.textContent = 'Localização Capturada ✓';
        geoStatus.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
        showToast('Localização obtida com sucesso!');
      },
      (err) => {
        console.warn('Permissão de geolocalização recusada ou indisponível', err);
        geoBtnText.textContent = 'Localização Opcional (Não Informada)';
        geoStatus.style.color = 'var(--color-text-muted)';
        geoStatus.textContent = 'Recusado ou indisponível. O checkout prosseguirá normalmente.';
        showToast('Sem problemas! Seu endereço digitado será utilizado.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });

  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.checkoutData.name = document.getElementById('inputName').value.trim();
    state.checkoutData.whatsapp = document.getElementById('inputWhatsapp').value.trim();
    state.checkoutData.email = document.getElementById('inputEmail').value.trim();
    state.checkoutData.address = document.getElementById('inputAddress').value.trim();

    saveCheckoutToStorage();
    window.location.hash = '#/verify';
  });
}

/* ==========================================================================
   VIEW 4: VERIFICATION (#/verify) - WebAuthn / CredentialsContainer
   ========================================================================== */
function renderVerifyView(container) {
  if (state.cart.length === 0) {
    window.location.hash = '#/';
    return;
  }

  container.innerHTML = `
    <div class="verify-view">
      <div class="page-title">
        <span class="material-symbols-outlined logo-icon">fingerprint</span>
        <span>Verificação de Segurança</span>
      </div>

      <div class="step-card">
        <span class="material-symbols-outlined step-icon">verified_user</span>
        <div class="step-title">Prova de Vida & Biometria</div>
        <p class="step-desc">
          Para garantir a segurança do seu pedido, utilize o leitor de biometria ou PIN do seu dispositivo para autenticar.
        </p>

        <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
          <button id="verifyBioBtn" class="btn-primary">
            <span class="material-symbols-outlined">fingerprint</span>
            Confirmar com Biometria / Dispositivo
          </button>

          <button id="verifyFallbackBtn" class="btn-outline">
            Continuar sem verificação biometria
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('verifyBioBtn').addEventListener('click', async () => {
    try {
      if (window.PublicKeyCredential && navigator.credentials && navigator.credentials.create) {
        // Tentativa de WebAuthn / CredentialsContainer
        const publicKeyCredentialCreationOptions = {
          challenge: Uint8Array.from("chicharitos_challenge_12345", c => c.charCodeAt(0)),
          rp: {
            name: "Chicharitos Artisanal Churros",
            id: window.location.hostname || "localhost"
          },
          user: {
            id: Uint8Array.from("user_id_101", c => c.charCodeAt(0)),
            name: state.checkoutData.email || "cliente@chicharitos.com",
            displayName: state.checkoutData.name || "Cliente Chicharitos"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform"
          },
          timeout: 60000
        };

        await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions
        });

        showToast('Autenticação biométrica realizada!');
        window.location.hash = '#/payment';
      } else {
        // Fallback PasswordCredential
        if (window.PasswordCredential && navigator.credentials.store) {
          const cred = new PasswordCredential({
            id: state.checkoutData.email || 'cliente',
            name: state.checkoutData.name || 'Cliente',
            password: 'biometric_fallback_pass'
          });
          await navigator.credentials.store(cred);
        }
        showToast('Verificação registrada no dispositivo!');
        window.location.hash = '#/payment';
      }
    } catch (err) {
      console.warn('NotAllowedError / NotSupportedError em CredentialsContainer', err);
      // Fallback gracioso
      showToast('Verificação indisponível neste dispositivo. Prosseguindo...');
      window.location.hash = '#/payment';
    }
  });

  document.getElementById('verifyFallbackBtn').addEventListener('click', () => {
    showToast('Prosseguindo para o pagamento...');
    window.location.hash = '#/payment';
  });
}

/* ==========================================================================
   VIEW 5: PAYMENT & WHATSAPP (#/payment)
   ========================================================================== */
function renderPaymentView(container) {
  if (state.cart.length === 0) {
    window.location.hash = '#/';
    return;
  }

  const total = calculateCartTotal();

  container.innerHTML = `
    <div class="payment-view">
      <div class="page-title">
        <span class="material-symbols-outlined logo-icon">payments</span>
        <span>Pagamento Simultâneo</span>
      </div>

      <div id="paymentStatusCard" class="step-card">
        <div class="pulse-spinner" id="paymentSpinner"></div>
        <div class="step-title" id="paymentStatusTitle">Processando Pagamento...</div>
        <p class="step-desc" id="paymentStatusDesc">
          Aguarde um momento enquanto conectamos com o gateway de pagamento.
        </p>
      </div>
    </div>
  `;

  // Simulação de gateway de pagamento
  setTimeout(() => {
    const card = document.getElementById('paymentStatusCard');
    if (!card) return;

    card.innerHTML = `
      <span class="material-symbols-outlined step-icon" style="color:var(--color-success); font-size:64px;">check_circle</span>
      <div class="step-title" style="color:var(--color-success);">Pagamento Aprovado!</div>
      <p class="step-desc">
        Seu pedido de <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong> foi verificado com sucesso.
      </p>

      <div style="background-color:var(--color-off-white); border:1px solid var(--color-bege); border-radius:12px; padding:12px; text-align:left; font-size:13px; margin-bottom:20px;">
        <strong>Resumo do Cliente:</strong><br/>
        • Nome: ${state.checkoutData.name}<br/>
        • WhatsApp: ${state.checkoutData.whatsapp}<br/>
        • Endereço: ${state.checkoutData.address}<br/>
        ${state.checkoutData.geolocation ? `• Localização GPS: Lat ${state.checkoutData.geolocation.latitude.toFixed(4)}, Lng ${state.checkoutData.geolocation.longitude.toFixed(4)}<br/>` : ''}
      </div>

      <a id="sendWhatsappBtn" target="_blank" href="#" class="btn-primary" style="background-color:#25D366; color:#fff;">
        <span class="material-symbols-outlined">send</span>
        Enviar Pedido via WhatsApp
      </a>
    `;

    // Gerar Link formatado para WhatsApp
    const whatsappBtn = document.getElementById('sendWhatsappBtn');
    const waNumber = state.menu.store.whatsapp.replace(/\D/g, '');

    let msg = `* NOVO PEDIDO - CHICHARITOS ARTISANAL CHURROS *\n\n`;
    msg += `*Cliente:* ${state.checkoutData.name}\n`;
    msg += `*WhatsApp:* ${state.checkoutData.whatsapp}\n`;
    msg += `*E-mail:* ${state.checkoutData.email}\n`;
    msg += `*Endereço:* ${state.checkoutData.address}\n`;

    if (state.checkoutData.geolocation) {
      msg += `*Localização GPS:* https://maps.google.com/?q=${state.checkoutData.geolocation.latitude},${state.checkoutData.geolocation.longitude}\n`;
    }

    msg += `\n* ITENS DO PEDIDO: *\n`;
    state.cart.forEach((item, idx) => {
      const optionalsText = item.optionals && item.optionals.length > 0
        ? ` (${item.optionals.map(o => o.name).join(', ')})`
        : '';
      const notesText = item.notes ? ` [Obs: ${item.notes}]` : '';
      const optionalsCost = (item.optionals || []).reduce((s, o) => s + o.price, 0);
      const sub = (item.unitPrice + optionalsCost) * item.qty;

      msg += `${idx + 1}. ${item.qty}x ${item.name}${optionalsText}${notesText} - R$ ${sub.toFixed(2).replace('.', ',')}\n`;
    });

    msg += `\n*Total a Pagar:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
    msg += `*Status Pagamento:* Aprovado (Simulação)\n\n`;
    msg += `Obrigado por escolher Chicharitos! 🍩`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    whatsappBtn.href = waUrl;

    whatsappBtn.addEventListener('click', () => {
      // Limpar carrinho após envio
      state.cart = [];
      saveCartToStorage();
    });

  }, 2000);
}
