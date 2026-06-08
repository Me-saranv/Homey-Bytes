// Admin Dashboard Functions

const ADMIN_PASSWORD = 'admin@2024';

function initAdmin() {
    loadDashboard();
    loadOrders();
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
    const customerSite = document.getElementById('customerSite');
    const adminSite = document.getElementById('adminSite');
    
    if (customerSite) customerSite.style.display = 'none';
    if (adminSite) adminSite.classList.add('show');
    
    initProducts();
    loadDashboard();
    loadOrders();
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
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const section = document.getElementById(tabId);
    if (section) section.classList.add('active');
    
    if (event.target) event.target.classList.add('active');

    // Load content based on tab
    if (tabId === 'products') renderProductsList();
    if (tabId === 'orders') loadOrders();
    if (tabId === 'dashboard') loadDashboard();
}

function loadDashboard() {
    document.getElementById('totalProducts').textContent = products.length;
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    document.getElementById('totalOrders').textContent = orders.length;
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Product</th>
                            <th>Customer Phone</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" style="text-align: center; color: #999; padding: 2rem;">
                                No orders yet
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
                        <th>Product</th>
                        <th>Customer Phone</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedOrders.map(o => `
                        <tr>
                            <td>${new Date(o.timestamp).toLocaleString()}</td>
                            <td><strong>${o.product}</strong></td>
                            <td>${o.phone || '-'}</td>
                            <td>${o.email || '-'}</td>
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

function deleteOrder(id) {
    if (confirm('Delete this order?')) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Sync to GitHub
        if (typeof gitSync !== 'undefined') {
            gitSync.syncOrders(orders);
        }
        
        loadOrders();
        loadDashboard();
        showAlert('✅ Order deleted!', 'success');
    }
}

function clearAllOrders() {
    if (confirm('Delete ALL orders?')) {
        if (confirm('This cannot be undone!')) {
            localStorage.removeItem('orders');
            loadOrders();
            loadDashboard();
            showAlert('✅ All orders cleared!', 'success');
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
    showAlert('✅ Settings saved!', 'success');
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
    showAlert('✅ GitHub credentials saved!', 'success');
}

async function testGitHubConnection() {
    if (!gitSync.token || !gitSync.owner || !gitSync.repo) {
        showAlert('❌ Please set up GitHub first!', 'error');
        return;
    }

    const status = document.getElementById('githubStatus');
    status.textContent = 'Testing connection...';

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
            status.textContent = '✅ Connected! GitHub sync is active.';
            showAlert('✅ GitHub connection successful!', 'success');
        } else {
            status.style.color = 'var(--danger)';
            status.textContent = '❌ Connection failed. Check credentials.';
            showAlert('❌ Connection failed!', 'error');
        }
    } catch (error) {
        status.style.color = 'var(--danger)';
        status.textContent = '❌ Connection error.';
        showAlert('❌ Connection error!', 'error');
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
    showAlert('✅ Data exported!', 'success');
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
            
            location.reload();
            showAlert('✅ Data imported!', 'success');
        } catch (err) {
            showAlert('❌ Invalid file!', 'error');
        }
    };
    reader.readAsText(file);
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alert');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert alert-${type} show`;
        setTimeout(() => alertBox.classList.remove('show'), 4000);
    }
}
