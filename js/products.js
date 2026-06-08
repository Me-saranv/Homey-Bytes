// Product Management Functions

let products = [];
let editingProductId = null;
let currentImage = null;

function initProducts() {
    loadProducts();
    renderProductsList();
}

function loadProducts() {
    const saved = localStorage.getItem('products');
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading products:', e);
            products = [];
        }
    } else {
        products = [
            { id: 1, name: 'Ragi Mixture', price: 150, desc: 'Nutritious ragi-based savory mixture with aromatic spices', emoji: '🌾', category: 'Mixture', image: null },
            { id: 2, name: 'Sweet Shankar Poli', price: 80, desc: 'Soft sweet flatbread filled with jaggery and dry fruits', emoji: '🥟', category: 'Sweet', image: null },
            { id: 3, name: 'Chakli', price: 100, desc: 'Savory spiral snack with cumin and chili flavors', emoji: '🌀', category: 'Savory', image: null },
            { id: 4, name: 'Fried Makhana', price: 120, desc: 'Crispy roasted fox nuts with light seasoning', emoji: '🍿', category: 'Snack', image: null },
        ];
        saveProducts();
    }
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
            const preview = document.getElementById('preview');
            if (preview) {
                preview.src = currentImage;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

function addProduct() {
    const name = document.getElementById('pName')?.value.trim() || '';
    const price = document.getElementById('pPrice')?.value.trim() || '';
    const desc = document.getElementById('pDesc')?.value.trim() || '';
    const emoji = document.getElementById('pEmoji')?.value.trim() || '🥘';
    const category = document.getElementById('pCategory')?.value.trim() || 'Snack';

    if (!name || !price || !desc) {
        showAlert('❌ Please fill Name, Price, and Description!', 'error');
        return;
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
            if (currentImage) product.image = currentImage;
        }
        editingProductId = null;
        showAlert(`✅ Product "${name}" UPDATED & SYNCED TO GITHUB!`, 'success');
    } else {
        // Add new product
        products.push({
            id: Date.now(),
            name, price: parseInt(price), desc, emoji, category,
            image: currentImage
        });
        showAlert(`✅ Product "${name}" ADDED & SYNCED TO GITHUB!`, 'success');
    }

    saveProducts();
    clearProductForm();
    renderProductsList();
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
        
        if (product.image) {
            const preview = document.getElementById('preview');
            preview.src = product.image;
            preview.style.display = 'block';
            currentImage = product.image;
        }

        showAlert(`✏️ Editing: "${product.name}" - Make changes & click Update!`, 'success');
        document.getElementById('pName').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (confirm(`🗑️ Delete "${product.name}"? This cannot be undone!`)) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsList();
        showAlert(`🗑️ Product "${product.name}" DELETED & REMOVED FROM GITHUB!`, 'success');
    }
}

function clearProductForm() {
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pDesc').value = '';
    document.getElementById('pEmoji').value = '🥘';
    document.getElementById('pCategory').value = '';
    const preview = document.getElementById('preview');
    if (preview) preview.style.display = 'none';
    document.getElementById('imageFile').value = '';
    currentImage = null;
    editingProductId = null;
    showAlert('🧹 Form cleared - Ready for new product!', 'success');
}

function renderProductsList() {
    const list = document.getElementById('productsList');
    if (!list) {
        console.log('productsList element not found');
        return;
    }

    // Load latest products from localStorage
    const saved = localStorage.getItem('products');
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing products:', e);
            products = [];
        }
    }
    
    console.log('Rendering products. Count:', products.length);
    
    if (!products || products.length === 0) {
        list.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 3rem; background: white; border-radius: 10px; margin-top: 1rem;"><p style="font-size: 1.2rem;">📦 No products yet</p><p style="font-size: 0.9rem; margin-top: 0.5rem; color: #999;">Click "➕ Add Product" to create your first snack!</p></div>';
        return;
    }

    list.innerHTML = products.map(p => `
        <div class="product-card-admin" style="border: 2px solid var(--light-purple); transition: all 0.3s;">
            <div class="product-card-admin-img">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji}
            </div>
            <h4 style="margin: 0.5rem 0;">🏷️ ${p.name}</h4>
            <div class="product-card-admin-price" style="margin: 0.5rem 0;">💰 ₹${p.price}</div>
            ${p.category ? `<div style="font-size: 0.85rem; color: var(--primary); margin: 0.3rem 0;">📂 ${p.category}</div>` : ''}
            <div class="product-card-admin-desc" style="margin: 0.8rem 0; padding: 0.8rem; background: var(--cream); border-radius: 5px; line-height: 1.4;">
                ${p.desc}
            </div>
            <div style="font-size: 0.8rem; color: #999; margin: 0.5rem 0;">
                ID: ${p.id}
            </div>
            <div class="product-card-admin-actions" style="gap: 0.3rem; margin-top: 1rem;">
                <button class="btn-edit" onclick="editProduct(${p.id})" style="flex: 1;">✏️ Edit</button>
                <button class="btn-danger" onclick="deleteProduct(${p.id})" style="flex: 1;">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function updateProductsOnWebsite() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map((p, i) => `
        <div class="product-card" onclick="orderProduct('${p.name}')">
            ${p.image ? `<img src="${p.image}" class="product-image" alt="${p.name}">` : `<div class="product-image">${p.emoji}</div>`}
            <div class="product-info">
                <div class="veg-badge">✓ VEG</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-footer">
                    <span class="product-price">₹${p.price}</span>
                    <button class="order-btn" onclick="event.stopPropagation(); orderProduct('${p.name}')">Order</button>
                </div>
            </div>
        </div>
    `).join('');
}

function orderProduct(name) {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const wa = (settings.whatsapp || '+91 8056580475').replace(/\D/g, '');
    
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({ 
        id: Date.now(), 
        product: name, 
        phone: settings.whatsapp || '+91 8056580475',
        email: settings.email || '',
        timestamp: new Date().toISOString() 
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    window.open(`https://wa.me/${wa}?text=I want to order ${name}`, '_blank');
}
