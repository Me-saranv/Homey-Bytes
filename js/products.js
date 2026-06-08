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
