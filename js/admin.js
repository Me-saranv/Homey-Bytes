function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const section = document.getElementById(tabId);
    if (section) section.classList.add('active');
    
    if (event.target) event.target.classList.add('active');

    // Load content based on tab
    if (tabId === 'products') {
        console.log('Loading products tab');
        loadProducts(); // Load from localStorage
        renderProductsList(); // Display the list
    }
    if (tabId === 'orders') {
        console.log('Loading orders tab');
        loadOrders();
    }
    if (tabId === 'dashboard') {
        console.log('Loading dashboard');
        loadDashboard();
    }
}
