// Main Website Functions

function initWebsite() {
    checkAdminLogin();
    // loadProducts() lives in products.js — it seeds defaults & backfills fields
    loadProducts();
    updateProductsOnWebsite();
    loadCart();
    updateCartCount();
}

function checkAdminLogin() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        const customerSite = document.getElementById('customerSite');
        const adminSite = document.getElementById('adminSite');
        if (customerSite) customerSite.style.display = 'none';
        if (adminSite) adminSite.classList.add('show');
        initAdmin();
    }
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alert');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert alert-${type} show`;
        setTimeout(() => alertBox.classList.remove('show'), 4000);
    }
}

// Smooth scroll
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.includes('admin')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    initWebsite();
});
