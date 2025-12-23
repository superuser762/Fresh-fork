class CartManager {
  constructor() {
    this.cartDrawer = document.getElementById('cart-drawer');
    this.cartToggle = document.querySelector('.cart-link');
    this.cartClose = document.querySelector('.cart-close');
    this.init();
  }

  init() {
    if (this.cartToggle) {
      this.cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    }

    if (this.cartClose) {
      this.cartClose.addEventListener('click', () => this.closeDrawer());
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDrawer();
    });

    // Close on outside click
    if (this.cartDrawer) {
      this.cartDrawer.addEventListener('click', (e) => {
        if (e.target === this.cartDrawer) this.closeDrawer();
      });
    }
  }

  openDrawer() {
    if (this.cartDrawer) {
      this.cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.loadCartContent();
    }
  }

  closeDrawer() {
    if (this.cartDrawer) {
      this.cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  loadCartContent() {
    fetch('/cart.json')
      .then(response => response.json())
      .then(cart => {
        const drawer = document.querySelector('.cart-drawer-content');
        if (drawer) {
          drawer.innerHTML = this.renderCart(cart);
          this.attachCartHandlers();
        }
      });
  }

  renderCart(cart) {
    if (cart.item_count === 0) {
      return '<p class="empty-cart">Your cart is empty</p>';
    }

    const items = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <p class="quantity">Qty: ${item.quantity}</p>
          <p class="price">${(item.price * item.quantity / 100).toFixed(2)}</p>
        </div>
        <button class="remove-btn" data-line-index="${item.key}">×</button>
      </div>
    `).join('');

    return `
      <div class="cart-items">${items}</div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${(cart.total_price / 100).toFixed(2)}</span>
        </div>
        <a href="/checkout" class="btn btn-checkout">Checkout</a>
      </div>
    `;
  }

  attachCartHandlers() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lineKey = e.target.dataset.lineIndex;
        this.removeItem(lineKey);
      });
    });
  }

  removeItem(lineKey) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: lineKey, quantity: 0 })
    })
    .then(() => {
      this.loadCartContent();
      this.updateCartCount();
    });
  }

  updateCartCount() {
    fetch('/cart.json')
      .then(response => response.json())
      .then(cart => {
        const count = document.getElementById('cart-count');
        if (count) count.textContent = cart.item_count;
      });
  }
}

document.addEventListener('DOMContentLoaded', () => new CartManager());