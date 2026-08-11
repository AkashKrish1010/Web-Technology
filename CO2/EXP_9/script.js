// ===== Product Catalog =====
const products = [
  { id: 1, name: 'Wireless Mechanical Keyboard', price: 3499, category: 'Peripherals', icon: '⌨️' },
  { id: 2, name: 'Ergonomic Gaming Mouse', price: 1899, category: 'Peripherals', icon: '🖱️' },
  { id: 3, name: '27" 4K Monitor', price: 24999, category: 'Electronics', icon: '🖥️' },
  { id: 4, name: 'Noise Cancelling Headphones', price: 5999, category: 'Audio', icon: '🎧' },
  { id: 5, name: 'USB-C Multiport Hub', price: 1499, category: 'Accessories', icon: '🔌' },
  { id: 6, name: 'HD Web Camera 1080p', price: 2299, category: 'Electronics', icon: '📷' },
];

let cart = [];
let discountRate = 0; // 0.1 for 10%

// Render Catalog
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <div class="p-icon">${p.icon}</div>
        <div class="p-title">${p.name}</div>
        <div class="p-cat">${p.category}</div>
      </div>
      <div>
        <div class="p-price">₹${p.price.toLocaleString('en-IN')}</div>
        <button class="btn-add-cart" onclick="addToCart(${p.id})">Add to Cart 🛒</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCart();
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const status = document.getElementById('promoStatus');
  if (code === 'SAVE10') {
    discountRate = 0.10;
    status.style.color = 'var(--success)';
    status.textContent = '✅ Promo code SAVE10 applied! (10% OFF)';
  } else if (code === 'STUDENT20') {
    discountRate = 0.20;
    status.style.color = 'var(--success)';
    status.textContent = '✅ Promo code STUDENT20 applied! (20% OFF)';
  } else {
    discountRate = 0;
    status.style.color = 'var(--error)';
    status.textContent = '❌ Invalid promo code. Try SAVE10 or STUDENT20';
  }
  updateCart();
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * discountRate;
  const taxable = subtotal - discount;
  const tax = taxable * 0.18; // 18% GST
  const total = taxable + tax;
  return { subtotal, discount, tax, total };
}

function updateCart() {
  const itemsContainer = document.getElementById('cartItems');
  const countEl = document.getElementById('cartItemCount');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty. Add products from the catalog!</p>';
  } else {
    itemsContainer.innerHTML = '';
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="item-info">
          <h4>${item.name}</h4>
          <span>₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      `;
      itemsContainer.appendChild(div);
    });
  }

  const { subtotal, discount, tax, total } = calculateTotals();
  document.getElementById('subtotalVal').textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('discountPct').textContent = `${discountRate * 100}`;
  document.getElementById('discountVal').textContent = `-₹${discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('taxVal').textContent = `+₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('totalVal').textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function generateInvoice() {
  if (cart.length === 0) {
    alert('Your cart is empty! Add products before checkout.');
    return;
  }

  const { subtotal, discount, tax, total } = calculateTotals();
  document.getElementById('invId').textContent = 'INV-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('invDate').textContent = new Date().toLocaleString();

  const tbody = document.getElementById('invoiceBody');
  tbody.innerHTML = '';
  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price.toLocaleString('en-IN')}</td>
      <td>${item.qty}</td>
      <td>₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('invoiceSummary').innerHTML = `
    <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
    <p>Discount: -₹${discount.toFixed(2)}</p>
    <p>GST (18%): ₹${tax.toFixed(2)}</p>
    <p style="font-size: 1.1rem; font-weight:800; color: var(--accent);">Grand Total: ₹${total.toFixed(2)}</p>
  `;

  document.getElementById('invoiceModal').style.display = 'flex';
}

function closeInvoice() {
  document.getElementById('invoiceModal').style.display = 'none';
}

renderProducts();
updateCart();
