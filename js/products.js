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
        products = JSON.parse(saved);
    } else {
        products = [
            { id: 1, name: 'Ragi Mixture', price: 150, desc: 'Nutritious ragi-based savory mixture', emoji: '🌾', category: 'Mixture', image: null },
            { id: 2, name: 'Sweet Shankar Poli', price: 80, desc: 'Soft sweet flatbread with jaggery filling', emoji: '🥟', category: 'Sweet', image: null },
            { id: 3, name: 'Chakli', price: 100, desc: 'Savory spiral snack with spices', emoji: '🌀', category: 'Savory', image: null },
            { id: 4, name: 'Fried Makhana', price: 120, desc: 'Crispy roasted fox nuts', emoji: '🍿', category: 'Snack', image: null },
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
        showAlert('✅ Product updated!', 'success');
    } else {
        // Add new product
        products.push({
            id: Date.now(),
            name, price: parseInt(price), desc, emoji, category,
            image: currentImage
        });
        showAlert('✅ Product added!', 'success');
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

        // Scroll to form
        document.getElementById('pName').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteProduct(id) {
    if (confirm('Delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsList();
        showAlert('✅ Product deleted!', 'success');
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
}

function renderProductsList() {
    const list = document.getElementById('productsList');
    if (!list) return;

    if (products.length === 0) {
        list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 2rem;">No products yet. Add one!</p>';
        return;
    }

    list.innerHTML = products.map(p => `
        <div class="product-card-admin">
            <div class="product-card-admin-img">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji}
            </div>
            <h4>${p.name}</h4>
            <div class="product-card-admin-price">₹${p.price}</div>
            <div class="product-card-admin-desc">${p.desc}</div>
            <div class="product-card-admin-actions">
                <button class="btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>
                <button class="btn-danger" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
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
