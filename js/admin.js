// Admin Dashboard Functions

const ADMIN_PASSWORD = 'admin@2024';

function initAdmin() {
    console.log('🚀 initAdmin() - Starting admin initialization');
    
    // Load products FIRST
    if (typeof loadProducts === 'function') {
        console.log('📥 Calling loadProducts()');
        loadProducts();
    }
    
    // Then render the list
    if (typeof renderProductsList === 'function') {
        console.log('🎨 Calling renderProductsList()');
        renderProductsList();
    }
    
    // Then load dashboard
    loadDashboard();
    
    // Then load orders
    loadOrders();
    
    console.log('✅ Admin initialization complete');
}

function showLogin() {
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('adminPwd').focus();
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('adminPwd').value = '';
}

function loginAdmin() {
    const pwd = document.getElementById('adminPwd').value;
    if (pwd === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        switchToAdmin();
        closeLogin();
    } else {
        showAlert('❌ Wrong password!', 'error');
        document.getElementById('adminPwd').value = '';
        document.getElementById('adminPwd').focus();
    }
}

function switchToAdmin() {
    console.log('🔄 Switching to admin view');
    const customerSite = document.getElementById('customerSite');
    const adminSite = document.getElementById('adminSite');
    
    if (customerSite) customerSite.style.display = 'none';
    if (adminSite) adminSite.classList.add('show');
    
    console.log('📱 Admin site shown');
    initProducts();
}

function logoutAdmin() {
    if (confirm('Logout?')) {
        localStorage.removeItem('adminLoggedIn');
        const adminSite = document.getElementById('adminSite');
        const customerSite = document.getElementById('customerSite');
        
        if (adminSite) adminSite.classList.remove('show');
        if (customerSite) customerSite.style.display = 'block';
        
        window.scrollTo(0, 0);
    }
}

function switchTab(tabId) {
    console.log('📑 Switching to tab:', tabId);
    
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const section = document.getElementById(tabId);
    if (section) {
        section.classList.add('active');
        console.log('✅ Section shown:', tabId);
    }
    
    // Highlight the matching sidebar item (works for click or programmatic calls)
    if (typeof event !== 'undefined' && event && event.target && event.target.classList) {
        event.target.classList.add('active');
    } else {
        document.querySelectorAll('.sidebar-item').forEach(s => {
            const oc = s.getAttribute('onclick') || '';
            if (oc.includes(`'${tabId}'`)) s.classList.add('active');
        });
    }

    // Load content based on tab
    if (tabId === 'productsadmin') {
        console.log('📦 Loading products tab');
        if (typeof loadProducts === 'function') {
            loadProducts();
        }
        if (typeof renderProductsList === 'function') {
            renderProductsList();
        }
    }
    if (tabId === 'orders') {
        console.log('📬 Loading orders tab');
        loadOrders();
    }
    if (tabId === 'dashboard') {
        console.log('📊 Loading dashboard');
        loadDashboard();
    }
}

function loadDashboard() {
    console.log('📊 Loading dashboard stats');
    const totalProducts = document.getElementById('totalProducts');
    const totalOrders = document.getElementById('totalOrders');
    
    if (totalProducts) {
        totalProducts.textContent = products.length;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (totalOrders) {
        totalOrders.textContent = orders.length;
    }
}

function loadOrders() {
    console.log('📬 Loading orders');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) {
        console.error('❌ ordersList element not found');
        return;
    }

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Contact & Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="6" style="text-align: center; color: #999; padding: 2rem;">
                                ℹ️ No orders yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        return;
    }

    const sortedOrders = [...orders].reverse();

    ordersList.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <button class="btn-danger" onclick="clearAllOrders()">🗑️ Clear All Orders</button>
        </div>
        <div class="orders-table">
            <table>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Contact & Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedOrders.map(o => `
                        <tr>
                            <td>${new Date(o.timestamp).toLocaleString()}</td>
                            <td><strong>${o.customer || o.product || '-'}</strong></td>
                            <td>${formatOrderItems(o)}</td>
                            <td><strong>${o.total != null ? '₹' + o.total : '-'}</strong></td>
                            <td>
                                ${o.phone ? `📱 ${o.phone}<br>` : ''}
                                ${o.address ? `📍 ${o.address}<br>` : ''}
                                ${o.notes ? `📝 ${o.notes}` : ''}
                                ${(!o.phone && !o.address) ? (o.email || '-') : ''}
                            </td>
                            <td>
                                <button class="btn-danger" onclick="deleteOrder(${o.id})" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Handles both new cart orders (items[]) and legacy single-product orders
function formatOrderItems(o) {
    if (Array.isArray(o.items) && o.items.length) {
        return o.items.map(i => `${i.name} × ${i.qty}`).join('<br>');
    }
    return o.product ? `${o.product} × 1` : '-';
}

function deleteOrder(id) {
    const order = JSON.parse(localStorage.getItem('orders') || '[]').find(o => o.id === id);
    const productName = order ? order.product : 'Order';
    
    if (confirm(`🗑️ Delete "${productName}" order? Cannot be undone!`)) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Sync to GitHub
        if (typeof gitSync !== 'undefined') {
            gitSync.syncOrders(orders);
        }
        
        loadOrders();
        loadDashboard();
        showAlert(`🗑️ Order "${productName}" DELETED & REMOVED FROM GITHUB!`, 'success');
    }
}

function clearAllOrders() {
    if (confirm('⚠️ Delete ALL orders? This cannot be undone!')) {
        if (confirm('Last chance - are you absolutely sure?')) {
            localStorage.removeItem('orders');
            loadOrders();
            loadDashboard();
            showAlert('🗑️ ALL ORDERS CLEARED & REMOVED FROM GITHUB!', 'success');
        }
    }
}

function saveSettings() {
    const settings = {
        whatsapp: document.getElementById('sWhatsapp').value,
        email: document.getElementById('sEmail').value,
        phone: document.getElementById('sPhone').value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    showAlert('✅ Contact settings SAVED! Website updated!', 'success');
}

function setupGitHub() {
    const owner = document.getElementById('sGithubOwner').value.trim();
    const repo = document.getElementById('sGithubRepo').value.trim();
    const token = document.getElementById('sGithubToken').value.trim();

    if (!owner || !repo || !token) {
        showAlert('❌ Please fill all GitHub fields!', 'error');
        return;
    }

    gitSync.setGitHubCredentials(owner, repo, token);
    showAlert('✅ GitHub credentials SAVED! Ready to sync!', 'success');
}

async function testGitHubConnection() {
    if (!gitSync.token || !gitSync.owner || !gitSync.repo) {
        showAlert('❌ Please set up GitHub first!', 'error');
        return;
    }

    const status = document.getElementById('githubStatus');
    status.textContent = '🔄 Testing connection...';

    try {
        const response = await fetch(
            `https://api.github.com/repos/${gitSync.owner}/${gitSync.repo}`,
            {
                headers: {
                    'Authorization': `token ${gitSync.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (response.ok) {
            status.style.color = 'var(--success)';
            status.textContent = '✅ Connected! GitHub sync is ACTIVE!';
            showAlert('✅ GitHub connection SUCCESSFUL! Auto-sync is ENABLED!', 'success');
        } else {
            status.style.color = 'var(--danger)';
            status.textContent = '❌ Connection failed. Check credentials.';
            showAlert('❌ GitHub connection FAILED! Check username, repo, or token!', 'error');
        }
    } catch (error) {
        status.style.color = 'var(--danger)';
        status.textContent = '❌ Connection error.';
        showAlert('❌ GitHub connection ERROR! Check internet!', 'error');
    }
}

function exportData() {
    const data = {
        products,
        orders: JSON.parse(localStorage.getItem('orders') || '[]'),
        settings: JSON.parse(localStorage.getItem('settings') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homey-bytes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showAlert(`📥 Data EXPORTED! File: homey-bytes-backup-${new Date().toISOString().split('T')[0]}.json`, 'success');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (data.products) {
                localStorage.setItem('products', JSON.stringify(data.products));
                products = data.products;
            }
            if (data.orders) localStorage.setItem('orders', JSON.stringify(data.orders));
            if (data.settings) localStorage.setItem('settings', JSON.stringify(data.settings));
            
            showAlert('📤 Data IMPORTED! Reloading...', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            showAlert('❌ Invalid file! Make sure it\'s exported JSON!', 'error');
        }
    };
    reader.readAsText(file);
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alert');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert alert-${type} show`;
        
        // Auto-hide after 4 seconds
        setTimeout(() => alertBox.classList.remove('show'), 4000);
    }
    
    // Also log to console
    console.log(`[${type.toUpperCase()}] ${message}`);
}
