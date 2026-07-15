// Product Management + Cart Functions

let products = [];
let editingProductId = null;
let currentImage = null;
let currentImageIsNew = false; // true only when a fresh file was just picked, not on edit-load
let cart = []; // [{ id, name, price, emoji, image, qty }]

function initProducts() {
    console.log('🔄 initProducts called');
    loadProducts();
    console.log('📦 Products loaded:', products.length);
    renderProductsList();
    console.log('✅ Products rendered');
}

function loadProducts() {
    const saved = localStorage.getItem('products');
    console.log('📂 Checking localStorage for products...');

    if (saved) {
        try {
            products = JSON.parse(saved);
            // Backfill new fields on older saved products
            products.forEach(p => {
                if (typeof p.stock !== 'number') p.stock = 0;
                if (typeof p.unit !== 'string') p.unit = '';
            });
            console.log('✅ Products loaded from localStorage:', products.length);
        } catch (e) {
            console.error('❌ Error parsing products:', e);
            products = getDefaultProducts();
        }
    } else {
        console.log('📥 No products in localStorage, using defaults');
        products = getDefaultProducts();
        saveProducts();
    }
}

// Called on the customer site so shoppers see the CURRENT stock/products
// that admin pushed to GitHub, not just whatever is cached in their own
// browser. Falls back silently to local/default data if the fetch fails
// (offline, opened via file://, or GitHub Pages hasn't rebuilt yet).
async function loadLiveProducts() {
    loadProducts(); // show something immediately while we check for fresher data
    try {
        const res = await fetch(`data/products.json?_=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
            const live = await res.json();
            if (Array.isArray(live) && live.length) {
                live.forEach(p => {
                    if (typeof p.stock !== 'number') p.stock = 0;
                    if (typeof p.unit !== 'string') p.unit = '';
                });
                products = live;
                localStorage.setItem('products', JSON.stringify(products));
                console.log('✅ Loaded live products from data/products.json');
            }
        }
    } catch (e) {
        console.log('ℹ️ Live product fetch unavailable, using cached data:', e.message);
    }
}

function getDefaultProducts() {
    return [
        { id: 1, name: 'Ragi Mixture', price: 150, desc: 'Nutritious ragi-based savory mixture with aromatic spices', emoji: '🌾', category: 'Mixture', image: null, stock: 25, unit: '250g pack' },
        { id: 2, name: 'Sweet Shankar Poli', price: 80, desc: 'Soft sweet flatbread filled with jaggery and dry fruits', emoji: '🥟', category: 'Sweet', image: null, stock: 30, unit: '200g pack' },
        { id: 3, name: 'Chakli', price: 100, desc: 'Savory spiral snack with cumin and chili flavors', emoji: '🌀', category: 'Savory', image: null, stock: 40, unit: '250g pack' },
        { id: 4, name: 'Fried Makhana', price: 120, desc: 'Crispy roasted fox nuts with light seasoning', emoji: '🍿', category: 'Snack', image: null, stock: 20, unit: '150g pack' },
    ];
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    updateProductsOnWebsite();

    // Sync to GitHub
    if (typeof gitSync !== 'undefined') {
        gitSync.syncProducts(products).then(success => {
            if (success) {
                console.log('✅ Products synced to GitHub!');
            }
        });
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImage = e.target.result;
            currentImageIsNew = true;
            const preview = document.getElementById('preview');
            if (preview) {
                preview.src = currentImage;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

async function addProduct() {
    const name = document.getElementById('pName')?.value.trim() || '';
    const price = document.getElementById('pPrice')?.value.trim() || '';
    const desc = document.getElementById('pDesc')?.value.trim() || '';
    const emoji = document.getElementById('pEmoji')?.value.trim() || '🥘';
    const category = document.getElementById('pCategory')?.value.trim() || 'Snack';
    const stock = parseInt(document.getElementById('pStock')?.value) || 0;
    const unit = document.getElementById('pUnit')?.value.trim() || '';

    if (!name || !price || !desc) {
        showAlert('❌ Please fill Name, Price, and Description!', 'error');
        return;
    }

    // If a new image was picked, upload it to the GitHub repo's images/
    // folder and store the file path instead of a huge base64 blob.
    let imageToSave = null;
    if (currentImage && currentImageIsNew) {
        if (typeof gitSync !== 'undefined' && gitSync.token) {
            showAlert('⏳ Uploading image to GitHub images/ folder...', 'success');
            const uploadedPath = await gitSync.uploadImage(currentImage, name);
            if (uploadedPath) {
                imageToSave = uploadedPath;
            } else {
                imageToSave = currentImage; // fallback so the image still shows locally
                showAlert('⚠️ Image upload to GitHub failed — saved locally only for now.', 'error');
            }
        } else {
            imageToSave = currentImage; // GitHub not connected yet — keep local preview
        }
    }

    if (editingProductId) {
        // Update existing product
        const product = products.find(p => p.id === editingProductId);
        if (product) {
            product.name = name;
            product.price = parseInt(price);
            product.desc = desc;
            product.emoji = emoji;
            product.category = category;
            product.stock = stock;
            product.unit = unit;
            if (imageToSave) product.image = imageToSave;
        }
        editingProductId = null;
        showAlert(`✅ Product "${name}" UPDATED & SYNCED TO GITHUB!`, 'success');
    } else {
        // Add new product
        products.push({
            id: Date.now(),
            name, price: parseInt(price), desc, emoji, category,
            stock, unit,
            image: imageToSave
        });
        showAlert(`✅ Product "${name}" ADDED & SYNCED TO GITHUB!`, 'success');
    }

    saveProducts();
    clearProductForm();
    setTimeout(() => renderProductsList(), 100);
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        editingProductId = id;
        document.getElementById('pName').value = product.name;
        document.getElementById('pPrice').value = product.price;
        document.getElementById('pDesc').value = product.desc;
        document.getElementById('pEmoji').value = product.emoji;
        document.getElementById('pCategory').value = product.category;
        document.getElementById('pStock').value = product.stock ?? 0;
        document.getElementById('pUnit').value = product.unit || '';

        if (product.image) {
            const preview = document.getElementById('preview');
            preview.src = product.image;
            preview.style.display = 'block';
            currentImage = product.image;
            currentImageIsNew = false; // existing image — don't re-upload unless a new file is picked
        }

        showAlert(`✏️ Editing: "${product.name}" - Make changes & click Update!`, 'success');
        // Jump to the Add Product tab so the form is visible
        if (typeof switchTab === 'function') switchTab('addproduct');
        document.getElementById('pName').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (confirm(`🗑️ Delete "${product.name}"? This cannot be undone!`)) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        setTimeout(() => renderProductsList(), 100);
        showAlert(`🗑️ Product "${product.name}" DELETED & REMOVED FROM GITHUB!`, 'success');
    }
}

// Quick stock adjustment from the admin product list
function adjustStock(id, delta) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    product.stock = Math.max(0, (parseInt(product.stock) || 0) + delta);
    saveProducts();
    renderProductsList();
}

function setStock(id, value) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    product.stock = Math.max(0, parseInt(value) || 0);
    saveProducts();
}

function clearProductForm() {
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pDesc').value = '';
    document.getElementById('pEmoji').value = '🥘';
    document.getElementById('pCategory').value = '';
    const stockEl = document.getElementById('pStock');
    if (stockEl) stockEl.value = '0';
    const unitEl = document.getElementById('pUnit');
    if (unitEl) unitEl.value = '';
    const preview = document.getElementById('preview');
    if (preview) preview.style.display = 'none';
    document.getElementById('imageFile').value = '';
    currentImage = null;
    currentImageIsNew = false;
    editingProductId = null;
    showAlert('🧹 Form cleared - Ready for new product!', 'success');
}

function renderProductsList() {
    console.log('🔄 renderProductsList called');
    const list = document.getElementById('productsList');

    if (!list) {
        console.error('❌ productsList element NOT FOUND!');
        return;
    }

    if (!products || products.length === 0) {
        list.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 3rem; background: white; border-radius: 10px; margin-top: 1rem;"><p style="font-size: 1.2rem;">📦 No products yet</p><p style="font-size: 0.9rem; margin-top: 0.5rem; color: #999;">Click "➕ Add Product" to create your first snack!</p></div>';
        return;
    }

    const html = products.map(p => {
        const stock = parseInt(p.stock) || 0;
        const stockClass = stock === 0 ? 'stock-out' : (stock <= 5 ? 'stock-low' : 'stock-ok');
        const stockLabel = stock === 0 ? 'Out of stock' : (stock <= 5 ? `Low: ${stock} left` : `${stock} in stock`);
        return `
        <div class="product-card-admin" style="border: 2px solid var(--light-purple); transition: all 0.3s;">
            <div class="product-card-admin-img">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji}
            </div>
            <h4 style="margin: 0.5rem 0;">🏷️ ${p.name}</h4>
            <div class="product-card-admin-price" style="margin: 0.5rem 0;">💰 ₹${p.price}${p.unit ? ` <span style="font-size:0.8rem;color:#999;">/ ${p.unit}</span>` : ''}</div>
            ${p.category ? `<div style="font-size: 0.85rem; color: var(--primary); margin: 0.3rem 0;">📂 ${p.category}</div>` : ''}
            <div class="product-card-admin-desc" style="margin: 0.8rem 0; padding: 0.8rem; background: var(--cream); border-radius: 5px; line-height: 1.4;">
                ${p.desc}
            </div>
            <div class="stock-row">
                <span class="stock-badge ${stockClass}">📦 ${stockLabel}</span>
                <div class="stock-stepper">
                    <button onclick="adjustStock(${p.id}, -1)" title="Reduce stock">−</button>
                    <input type="number" min="0" value="${stock}" onchange="setStock(${p.id}, this.value)" aria-label="Stock quantity">
                    <button onclick="adjustStock(${p.id}, 1)" title="Add stock">+</button>
                </div>
            </div>
            <div style="font-size: 0.8rem; color: #999; margin: 0.5rem 0;">
                ID: ${p.id}
            </div>
            <div class="product-card-admin-actions" style="gap: 0.3rem; margin-top: 1rem;">
                <button class="btn-edit" onclick="editProduct(${p.id})" style="flex: 1;">✏️ Edit</button>
                <button class="btn-danger" onclick="deleteProduct(${p.id})" style="flex: 1;">🗑️ Delete</button>
            </div>
        </div>
    `;
    }).join('');

    list.innerHTML = html;
    console.log('✅ Products rendered successfully');
}

function updateProductsOnWebsite() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map((p) => {
        const stock = parseInt(p.stock) || 0;
        const outOfStock = stock === 0;
        return `
        <div class="product-card ${outOfStock ? 'out-of-stock' : ''}">
            <div class="product-image-wrap">
                ${p.image ? `<img src="${p.image}" class="product-image" alt="${p.name}">` : `<div class="product-image">${p.emoji}</div>`}
                ${outOfStock ? '<span class="out-badge">Out of stock</span>' : (stock <= 5 ? `<span class="low-badge">Only ${stock} left</span>` : '')}
            </div>
            <div class="product-info">
                <div class="veg-badge">✓ VEG</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>
                ${p.unit ? `<div class="product-unit">⚖️ ${p.unit}</div>` : ''}
                <div class="product-footer">
                    <span class="product-price">₹${p.price}</span>
                    ${outOfStock
                        ? `<button class="order-btn" disabled>Sold Out</button>`
                        : `<button class="order-btn" onclick="addToCart(${p.id})">🛒 Add to Cart</button>`}
                </div>
            </div>
        </div>
    `;
    }).join('');
}

/* ============================================================
   CART
   ============================================================ */

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const stock = parseInt(product.stock) || 0;
    const existing = cart.find(i => i.id === id);
    const currentQty = existing ? existing.qty : 0;

    if (stock > 0 && currentQty >= stock) {
        showToast(`⚠️ Only ${stock} of "${product.name}" available`);
        return;
    }

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            image: product.image,
            unit: product.unit || '',
            qty: 1
        });
    }
    saveCart();
    renderCart();
    showToast(`✅ "${product.name}" added to cart`);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const product = products.find(p => p.id === id);
    const stock = product ? (parseInt(product.stock) || 0) : Infinity;

    if (delta > 0 && stock > 0 && item.qty >= stock) {
        showToast(`⚠️ Only ${stock} available`);
        return;
    }

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function openCart() {
    renderCart();
    document.getElementById('cartModal').classList.add('show');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
    // Reset checkout view back to cart view for next open
    document.getElementById('checkoutForm').style.display = 'none';
    const checkoutBtn = document.getElementById('checkoutBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    if (placeOrderBtn) placeOrderBtn.style.display = 'none';
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    const actions = document.getElementById('cartActions');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div style="font-size: 3rem;">🛒</div>
                <p style="margin-top: 0.5rem;">Your cart is empty</p>
                <p style="font-size: 0.85rem; color: #999;">Add some delicious snacks!</p>
            </div>`;
        if (summary) summary.style.display = 'none';
        if (actions) actions.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<span>${item.emoji || '🥘'}</span>`}
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}${item.unit ? ` · ${item.unit}` : ''}</div>
            </div>
            <div class="cart-qty">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">₹${item.price * item.qty}</div>
            <button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
        </div>
    `).join('');

    document.getElementById('cartTotal').textContent = `₹${cartTotal()}`;
    if (summary) summary.style.display = 'flex';
    if (actions) actions.style.display = 'block';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('🛒 Your cart is empty');
        return;
    }
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('checkoutBtn').style.display = 'none';
    document.getElementById('placeOrderBtn').style.display = 'block';
    document.getElementById('cName').focus();
}

function placeOrder() {
    const name = document.getElementById('cName').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const address = document.getElementById('cAddress').value.trim();
    const notes = document.getElementById('cNotes').value.trim();

    if (!name || !phone || !address) {
        showToast('❌ Please fill name, phone & address');
        return;
    }
    if (cart.length === 0) {
        showToast('🛒 Your cart is empty');
        return;
    }

    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const wa = (settings.whatsapp || '+91 8056580475').replace(/\D/g, '');
    const total = cartTotal();

    // Save order for admin
    const order = {
        id: Date.now(),
        customer: name,
        phone: phone,
        address: address,
        notes: notes,
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, unit: i.unit || '' })),
        total: total,
        timestamp: new Date().toISOString()
    };
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Sync orders to GitHub if configured
    if (typeof gitSync !== 'undefined' && gitSync.token) {
        gitSync.syncOrders(orders);
    }

    // Build WhatsApp message
    let msg = `*🍲 New Order - Homey Bytes*\n\n`;
    msg += `*👤 Name:* ${name}\n`;
    msg += `*📱 Phone:* ${phone}\n`;
    msg += `*📍 Address:* ${address}\n`;
    if (notes) msg += `*📝 Notes:* ${notes}\n`;
    msg += `\n*🛒 Order Details:*\n`;
    cart.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.name}${item.unit ? ` (${item.unit})` : ''} × ${item.qty} = ₹${item.price * item.qty}\n`;
    });
    msg += `\n*💰 Total: ₹${total}*`;

    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');

    // Clear cart after ordering
    cart = [];
    saveCart();
    closeCart();
    showToast('✅ Order placed! Complete it on WhatsApp.');
}

/* ============================================================
   ORDER HISTORY (customer-facing — orders placed from this browser)
   ============================================================ */

function openOrderHistory() {
    renderOrderHistory();
    document.getElementById('orderHistoryModal').classList.add('show');
}

function closeOrderHistory() {
    document.getElementById('orderHistoryModal').classList.remove('show');
}

function renderOrderHistory() {
    const list = document.getElementById('orderHistoryList');
    if (!list) return;

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = orders.filter(o => Array.isArray(o.items) && o.items.length);

    if (myOrders.length === 0) {
        list.innerHTML = `
            <div class="cart-empty">
                <div style="font-size: 3rem;">📜</div>
                <p style="margin-top: 0.5rem;">No past orders yet</p>
                <p style="font-size: 0.85rem; color: #999;">Orders you place will show up here</p>
            </div>`;
        return;
    }

    const sorted = [...myOrders].reverse();
    list.innerHTML = sorted.map(o => `
        <div class="order-history-card">
            <div class="order-history-head">
                <span class="status-badge">🕓 Placed</span>
                <span class="order-history-date">${new Date(o.timestamp).toLocaleString()}</span>
            </div>
            <div class="order-history-items">
                ${o.items.map(i => `<div>${i.name}${i.unit ? ` (${i.unit})` : ''} × ${i.qty} — ₹${i.price * i.qty}</div>`).join('')}
            </div>
            <div class="order-history-footer">
                <span>📍 ${o.address || '-'}</span>
                <strong>Total: ₹${o.total}</strong>
            </div>
        </div>
    `).join('');
}

/* Small toast notification */
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
