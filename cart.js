// ============================================================
// COURTSIDE FRONT-ROW — cart.js
// ============================================================

const CART_KEY = 'cfr-cart';

// ── Storage helpers ──────────────────────────────────────────

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateNavCount();
  renderItems();
}

// ── Cart operations ──────────────────────────────────────────

function addItem(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id && i.size === item.size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function removeItem(id, size) {
  saveCart(getCart().filter(i => !(i.id === id && i.size === size)));
}

function updateQty(id, size, qty) {
  if (qty <= 0) return removeItem(id, size);
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) { item.qty = qty; saveCart(cart); }
}

function getCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ── Nav counter ──────────────────────────────────────────────

function updateNavCount() {
  const count = getCount();
  document.querySelectorAll('.nav__link--cart').forEach(el => {
    el.textContent = `Bag (${count})`;
  });
}

// ── Drawer open / close ──────────────────────────────────────

function openCart() {
  document.getElementById('cartDrawer').classList.add('cart-drawer--open');
  document.body.classList.add('cart-open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('cart-drawer--open');
  document.body.classList.remove('cart-open');
}

// ── Render drawer items ──────────────────────────────────────

function renderItems() {
  const cart = getCart();
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-drawer__empty">Your bag is empty.</p>';
    footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item__details">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__meta">Size: ${item.size}</p>
        <div class="cart-item__qty-row">
          <button class="cart-item__qty-btn" data-action="dec" data-id="${item.id}" data-size="${item.size}">−</button>
          <span class="cart-item__qty-num">${item.qty}</span>
          <button class="cart-item__qty-btn" data-action="inc" data-id="${item.id}" data-size="${item.size}">+</button>
        </div>
      </div>
      <div class="cart-item__right">
        <p class="cart-item__price">€${(item.price * item.qty)}</p>
        <button class="cart-item__remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
      </div>
    </div>
  `).join('');

  footerEl.innerHTML = `
    <div class="cart-drawer__subtotal">
      <span>Subtotal</span>
      <span>€${getSubtotal()}</span>
    </div>
    <p class="cart-drawer__shipping">Shipping calculated at checkout.</p>
    <button class="btn btn--solid cart-drawer__checkout">Proceed to Checkout</button>
  `;

  // Qty buttons
  itemsEl.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, size, action } = btn.dataset;
      const item = getCart().find(i => i.id === id && i.size === size);
      if (item) updateQty(id, size, item.qty + (action === 'inc' ? 1 : -1));
    });
  });

  // Remove buttons
  itemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id, btn.dataset.size));
  });
}

// ── Build drawer HTML ────────────────────────────────────────

function buildDrawer() {
  if (document.getElementById('cartDrawer')) return;
  const el = document.createElement('div');
  el.id = 'cartDrawer';
  el.className = 'cart-drawer';
  el.innerHTML = `
    <div class="cart-drawer__backdrop" id="cartBackdrop"></div>
    <div class="cart-drawer__panel">
      <div class="cart-drawer__header">
        <p class="cart-drawer__title">Your Bag</p>
        <button class="cart-drawer__close" id="cartClose" aria-label="Close bag">✕</button>
      </div>
      <div class="cart-drawer__items" id="cartItems"></div>
      <div class="cart-drawer__footer" id="cartFooter"></div>
    </div>
  `;
  document.body.appendChild(el);
  document.getElementById('cartBackdrop').addEventListener('click', closeCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
}

// ── Add-to-cart buttons ──────────────────────────────────────

function initAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeSize = document.querySelector('.pdp__size--active');
      if (!activeSize) {
        // Flash the size grid if no size selected
        const grid = document.querySelector('.pdp__size-grid');
        grid.classList.add('pdp__size-grid--error');
        setTimeout(() => grid.classList.remove('pdp__size-grid--error'), 800);
        return;
      }
      addItem({
        id:    btn.dataset.productId,
        name:  btn.dataset.productName,
        price: parseFloat(btn.dataset.productPrice),
        image: btn.dataset.productImage,
        size:  activeSize.textContent.trim(),
      });
    });
  });
}

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildDrawer();
  renderItems();
  updateNavCount();
  initAddToCart();

  document.querySelectorAll('.nav__link--cart').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openCart(); });
  });
});
