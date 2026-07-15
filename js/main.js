// Main Website Functions

async function initWebsite() {
    checkAdminLogin();
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    if (isAdmin) {
        // Admin edits localStorage directly — don't let a background fetch
        // clobber in-progress changes. loadProducts() lives in products.js.
        loadProducts();
    } else {
        // Shoppers should see the current live stock/products from GitHub,
        // not just whatever was cached in their browser.
        await loadLiveProducts();
    }

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
