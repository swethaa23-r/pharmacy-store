/**
 * STACKLY - Shopping Cart Engine & LocalStorage State Management
 */

const CART_STORAGE_KEY = 'stackly_cart_v1';

const PROMO_CODES = {
    'STACK20': { discountPercent: 20, description: '20% Off Storewide' },
    'PHAR20': { discountPercent: 20, description: '20% Off Storewide' },
    'HEALTH10': { discountPercent: 10, description: '10% Off Health Essentials' },
    'WELCOME15': { discountPercent: 15, description: '15% Off First Order' }
};

function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        let cart = stored ? JSON.parse(stored) : [];
        
        // Auto-heal cart: remove items that no longer exist in our product database
        if (typeof getProductById === 'function' && cart.length > 0) {
            const initialLen = cart.length;
            cart = cart.filter(item => getProductById(item.id) !== null);
            if (cart.length !== initialLen) {
                // Update storage silently
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            }
        }
        return cart;
    } catch (e) {
        console.error('Failed to parse cart storage', e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
        window.dispatchEvent(new CustomEvent('stackly-cart-updated', { detail: cart }));
    } catch (e) {
        console.error('Failed to save cart storage', e);
    }
}

function addToCart(productId, quantity = 1, showToastNotification = true) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity, addedAt: Date.now() });
    }

    saveCart(cart);

    if (showToastNotification && product) {
        showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
    }
}

function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);

    if (product) {
        showToast(`Removed ${product.name} from cart.`, 'info');
    }
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
    window.dispatchEvent(new CustomEvent('stackly-cart-updated', { detail: [] }));
}

function getCartTotals(appliedPromoCode = null) {
    const cart = getCart();
    let subtotal = 0;

    const items = cart.map(cartItem => {
        const product = typeof getProductById === 'function' ? getProductById(cartItem.id) : null;
        if (!product) return null;
        const itemSubtotal = product.price * cartItem.quantity;
        subtotal += itemSubtotal;
        return {
            ...cartItem,
            product,
            itemSubtotal
        };
    }).filter(Boolean);

    // Free shipping over $50
    const freeShippingThreshold = 50;
    const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 4.99;
    const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    let discountAmount = 0;
    if (appliedPromoCode && PROMO_CODES[appliedPromoCode]) {
        const percent = PROMO_CODES[appliedPromoCode].discountPercent;
        discountAmount = (subtotal * percent) / 100;
    }

    const total = Math.max(0, subtotal - discountAmount + shipping);

    return {
        items,
        totalItemsCount: items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal,
        shipping,
        discountAmount,
        total,
        freeShippingProgress
    };
}

function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badgeEls = document.querySelectorAll('.js-cart-count');
    badgeEls.forEach(el => {
        el.textContent = totalCount;
    });
}

function showToast(message, type = 'success') {
    let container = document.getElementById('stackly-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'stackly-toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 3000);
}

// Initial badge check on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
