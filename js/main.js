/**
 * STACKLY - Core Application Logic & Page Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    initNewsletterForm();
    initQuickViewModal();
    
    // Page specific initializers based on present DOM elements
    if (document.getElementById('featured-products-grid')) {
        renderFeaturedProducts();
    }

    if (document.getElementById('shop-products-grid')) {
        initShopPage();
    }

    if (document.getElementById('product-detail-container')) {
        initProductDetailPage();
    }

    if (document.getElementById('cart-items-container')) {
        initCartPage();
    }

    if (document.getElementById('contact-form')) {
        initContactPage();
    }

    if (document.getElementById('login-form')) {
        initLoginPage();
    }

    if (document.getElementById('signup-form')) {
        initSignupPage();
    }
});

/* ==========================================================================
   GLOBAL UTILITIES & RENDERERS
   ========================================================================== */

function getWishlist() {
    try {
        const stored = localStorage.getItem('stackly_wishlist');
        let wishlist = stored ? JSON.parse(stored) : [];
        
        // Auto-heal wishlist
        if (typeof getProductById === 'function' && wishlist.length > 0) {
            const initialLen = wishlist.length;
            wishlist = wishlist.filter(id => getProductById(id) !== null);
            if (wishlist.length !== initialLen) {
                localStorage.setItem('stackly_wishlist', JSON.stringify(wishlist));
            }
        }
        return wishlist;
    } catch (e) {
        console.error('Failed to parse wishlist', e);
        return [];
    }
}

function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;

    if (index > -1) {
        wishlist.splice(index, 1);
        if (product) showToast(`${product.name} removed from Wishlist.`, 'info');
    } else {
        wishlist.push(productId);
        if (product) showToast(`${product.name} added to Wishlist!`, 'success');
    }

    localStorage.setItem('stackly_wishlist', JSON.stringify(wishlist));
    return wishlist;
}


function renderProductCardHTML(p) {
    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(p.id);

    const stars = Array.from({ length: 5 }, (_, i) => {
        return i < Math.floor(p.rating) 
            ? '<i class="fas fa-star text-amber"></i>' 
            : (i < p.rating ? '<i class="fas fa-star-half-alt text-amber"></i>' : '<i class="far fa-star text-gray"></i>');
    }).join('');

    return `
        <div class="product-card js-animate-card" data-id="${p.id}">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            <div class="product-image-box">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-overlay-actions">
                    <button class="action-btn js-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Toggle Wishlist">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart" style="${isWishlisted ? 'color: var(--danger);' : ''}"></i>
                    </button>
                    <button class="action-btn js-quick-view" data-id="${p.id}" aria-label="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <a href="product.html?id=${p.id}" class="action-btn" aria-label="View Details">
                        <i class="fas fa-link"></i>
                    </a>
                </div>
            </div>
            <div class="product-content">
                <span class="product-category">${p.category}</span>
                <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-score">${p.rating}</span>
                    <span class="reviews-count">(${p.reviewsCount})</span>
                </div>
                <div class="product-price-row">
                    <div class="prices">
                        <span class="current-price">$${p.price.toFixed(2)}</span>
                        ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    ${p.discount ? `<span class="discount-pill">-${p.discount}%</span>` : ''}
                </div>
                <div class="product-card-actions">
                    <button class="btn btn-outline btn-sm js-add-cart" data-id="${p.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-primary btn-sm js-buy-now" data-id="${p.id}">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachProductCardEvents(container) {
    if (!container) return;

    container.querySelectorAll('.js-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            addToCart(id, 1);
        });
    });

    container.querySelectorAll('.js-buy-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            addToCart(id, 1, false);
            window.location.href = 'cart.html';
        });
    });

    container.querySelectorAll('.js-quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            openQuickView(id);
        });
    });

    container.querySelectorAll('.js-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            toggleWishlist(id);
            const icon = btn.querySelector('i');
            if (icon) {
                const wishlist = getWishlist();
                const active = wishlist.includes(id);
                icon.className = `${active ? 'fas' : 'far'} fa-heart`;
                icon.style.color = active ? 'var(--danger)' : '';
            }
        });
    });
}

/* ==========================================================================
   HOME PAGE HANDLERS
   ========================================================================== */

function renderFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid || typeof PRODUCTS === 'undefined') return;

    const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 8);
    grid.innerHTML = featured.map(p => renderProductCardHTML(p)).join('');
    attachProductCardEvents(grid);
}

/* ==========================================================================
   SHOP PAGE HANDLERS
   ========================================================================== */

function initShopPage() {
    const grid = document.getElementById('shop-products-grid');
    const searchInput = document.getElementById('shop-search-input');
    const categoryPills = document.querySelectorAll('.shop-category-pill');
    const sortSelect = document.getElementById('shop-sort-select');
    const ratingSelect = document.getElementById('shop-rating-select');
    const priceSlider = document.getElementById('shop-price-slider');
    const priceValDisplay = document.getElementById('shop-price-val');
    const resultsCount = document.getElementById('shop-results-count');

    let currentCategory = 'all';
    let currentSearch = '';
    let currentSort = 'default';
    let currentMaxPrice = 100;
    let currentMinRating = 0;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        currentCategory = urlParams.get('category');
        categoryPills.forEach(pill => {
            if (pill.getAttribute('data-category') === currentCategory) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    if (urlParams.has('search')) {
        currentSearch = urlParams.get('search');
        if (searchInput) searchInput.value = currentSearch;
    }

    function updateShopGrid() {
        if (typeof searchProducts !== 'function') return;

        const results = searchProducts(currentSearch, currentCategory, currentSort, currentMaxPrice, currentMinRating);
        
        if (resultsCount) {
            resultsCount.textContent = `Showing ${results.length} healthcare product${results.length === 1 ? '' : 's'}`;
        }

        if (results.length === 0) {
            grid.innerHTML = `
                <div class="empty-products-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--white); border-radius: 20px; border: 1px solid var(--border-color);">
                    <i class="fas fa-search-minus text-4xl text-teal mb-3" style="font-size: 3rem; color: var(--primary);"></i>
                    <h3 style="color: var(--secondary); margin-bottom: 8px;">No healthcare products found</h3>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your search terms, price limit, or category filter.</p>
                    <button class="btn btn-primary" id="reset-filters-btn">Reset All Filters</button>
                </div>
            `;
            const resetBtn = document.getElementById('reset-filters-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    currentCategory = 'all';
                    currentSearch = '';
                    currentSort = 'default';
                    currentMaxPrice = 100;
                    currentMinRating = 0;
                    if (searchInput) searchInput.value = '';
                    if (priceSlider) priceSlider.value = 100;
                    if (priceValDisplay) priceValDisplay.textContent = '$100';
                    if (sortSelect) sortSelect.value = 'default';
                    if (ratingSelect) ratingSelect.value = '0';
                    categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
                    updateShopGrid();
                });
            }
            return;
        }

        grid.innerHTML = results.map(p => renderProductCardHTML(p)).join('');
        attachProductCardEvents(grid);

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(grid.querySelectorAll('.product-card'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity' }
            );
        }
    }

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.getAttribute('data-category');
            updateShopGrid();
        });
    });

    if (searchInput) {
        let timer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                currentSearch = e.target.value.trim();
                updateShopGrid();
            }, 250);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (searchInput.value.trim().length > 0) {
                    window.location.href = '404.html';
                }
            }
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            updateShopGrid();
        });
    }

    if (ratingSelect) {
        ratingSelect.addEventListener('change', (e) => {
            currentMinRating = parseFloat(e.target.value);
            updateShopGrid();
        });
    }

    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            currentMaxPrice = parseFloat(e.target.value);
            if (priceValDisplay) priceValDisplay.textContent = `$${currentMaxPrice}`;
            updateShopGrid();
        });
    }

    updateShopGrid();
}

/* ==========================================================================
   PRODUCT DETAIL PAGE HANDLERS
   ========================================================================== */

function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'prod-1';
    const product = typeof getProductById === 'function' ? getProductById(productId) : PRODUCTS[0];

    const container = document.getElementById('product-detail-container');
    if (!container || !product) return;

    document.title = `${product.name} - STACKLY`;


    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(product.id);

    const stars = Array.from({ length: 5 }, (_, i) => {
        return i < Math.floor(product.rating) 
            ? '<i class="fas fa-star text-amber"></i>' 
            : (i < product.rating ? '<i class="fas fa-star-half-alt text-amber"></i>' : '<i class="far fa-star text-gray"></i>');
    }).join('');

    const benefitsHTML = product.benefits ? product.benefits.map(b => `
        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle text-teal" style="color: var(--primary);"></i> ${b}
        </li>
    `).join('') : '';

    // Gallery thumbnails (using main image as placeholders to avoid broken images)
    const galleryThumbnails = [
        product.image,
        product.image,
        product.image
    ];

    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-gallery">
                <div class="main-image-wrapper">
                    <img id="detail-main-img" src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="thumbnail-gallery" style="display: flex; gap: 12px; margin-top: 16px;">
                    ${galleryThumbnails.map((thumb, idx) => `
                        <div class="thumb-box ${idx === 0 ? 'active' : ''}" style="width: 72px; height: 72px; border-radius: var(--radius-sm); border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-color)'}; overflow: hidden; cursor: pointer;">
                            <img src="${thumb}" alt="Thumbnail ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="product-info-panel">
                <nav class="breadcrumb" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                    <a href="index.html">Home</a> &gt; <a href="shop.html">Shop</a> &gt; <a href="shop.html?category=${product.categorySlug}">${product.category}</a>
                </nav>

                <h1 class="product-detail-title">${product.name}</h1>

                <div class="product-meta-row">
                    <div class="stars">${stars}</div>
                    <span class="rating-score">${product.rating}</span>
                    <span class="reviews-count">(${product.reviewsCount} customer reviews)</span>
                    <span class="stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}">
                        <i class="fas ${product.inStock ? 'fa-check' : 'fa-times'}"></i> ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <div class="detail-price-box">
                    <span class="detail-current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="detail-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount-pill">Save ${product.discount}%</span>` : ''}
                </div>

                <p class="product-detail-short-desc">${product.shortDescription || product.description || ''}</p>

                <div class="quantity-add-row" style="align-items: center;">
                    <div class="quantity-selector">
                        <button type="button" class="qty-btn" id="qty-minus" aria-label="Decrease quantity"><i class="fas fa-minus"></i></button>
                        <input type="number" id="qty-input" value="1" min="1" max="99" readonly aria-label="Quantity">
                        <button type="button" class="qty-btn" id="qty-plus" aria-label="Increase quantity"><i class="fas fa-plus"></i></button>
                    </div>

                    <button class="btn btn-outline btn-lg" id="detail-add-cart">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>

                    <button class="btn btn-primary btn-lg" id="detail-buy-now">
                        Buy Now
                    </button>

                    <button class="icon-action-btn js-detail-wishlist" id="detail-wishlist-btn" aria-label="Toggle Wishlist" style="width: 48px; height: 48px; font-size: 1.2rem;">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart" style="${isWishlisted ? 'color: var(--danger);' : ''}"></i>
                    </button>
                </div>

                <div class="trust-perks-list">
                    <div class="perk-item"><i class="fas fa-truck"></i> Fast Delivery</div>
                    <div class="perk-item"><i class="fas fa-box"></i> Secure Packaging</div>
                    <div class="perk-item"><i class="fas fa-shield-alt"></i> Authentic Product</div>
                </div>

                <!-- PRODUCT INFORMATION TABS -->
                <div class="product-tabs">
                    <div class="tab-headers">
                        <button class="tab-btn active" data-tab="desc-tab">Description</button>
                        <button class="tab-btn" data-tab="benefits-tab">Benefits</button>
                        <button class="tab-btn" data-tab="usage-tab">Usage Information</button>
                        <button class="tab-btn" data-tab="specs-tab">Specifications</button>
                    </div>
                    <div class="tab-content active" id="desc-tab">
                        <p style="color: var(--text-main); line-height: 1.6;">${product.description}</p>
                    </div>
                    <div class="tab-content" id="benefits-tab">
                        <h4 class="mb-3" style="font-size: 1.05rem; color: var(--secondary);">Key Clinical Benefits:</h4>
                        <ul class="benefits-list" style="list-style: none; padding: 0;">${benefitsHTML}</ul>
                    </div>
                    <div class="tab-content" id="usage-tab">
                        <h4 class="mb-2" style="font-size: 1.05rem; color: var(--secondary);">Recommended Dosage & Directions:</h4>
                        <p style="color: var(--text-main); line-height: 1.6;">${product.usage}</p>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 12px;"><strong>Safety Note:</strong> ${product.safetyInfo}</p>
                    </div>
                    <div class="tab-content" id="specs-tab">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; font-weight: 600;">Category</td><td style="padding: 8px 0; color: var(--text-muted);">${product.category}</td></tr>
                            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; font-weight: 600;">Formulation</td><td style="padding: 8px 0; color: var(--text-muted);">Clinical Grade Formula</td></tr>
                            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; font-weight: 600;">Storage</td><td style="padding: 8px 0; color: var(--text-muted);">Store below 25°C in a cool dry place</td></tr>
                            <tr><td style="padding: 8px 0; font-weight: 600;">Authenticity</td><td style="padding: 8px 0; color: var(--text-muted);">100% Guaranteed Lab Verified</td></tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thumbnail gallery click event
    const mainImg = document.getElementById('detail-main-img');
    const thumbs = container.querySelectorAll('.thumb-box');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.style.borderColor = 'var(--border-color)');
            thumb.style.borderColor = 'var(--primary)';
            const newSrc = thumb.querySelector('img').getAttribute('src');
            if (mainImg) mainImg.setAttribute('src', newSrc);
        });
    });

    // Quantity selector logic
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10);
        if (val > 1) qtyInput.value = val - 1;
    });

    qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10);
        if (val < 99) qtyInput.value = val + 1;
    });

    // Wishlist button logic
    const wishlistBtn = document.getElementById('detail-wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            toggleWishlist(product.id);
            const icon = wishlistBtn.querySelector('i');
            const active = getWishlist().includes(product.id);
            icon.className = `${active ? 'fas' : 'far'} fa-heart`;
            icon.style.color = active ? 'var(--danger)' : '';
        });
    }

    // Add to cart & Buy now
    document.getElementById('detail-add-cart').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value, 10);
        addToCart(product.id, qty);
    });

    document.getElementById('detail-buy-now').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value, 10);
        addToCart(product.id, qty, false);
        window.location.href = 'cart.html';
    });

    // Tab buttons logic
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Render 4 Related Products
    renderRelatedProducts(product);
}

function renderRelatedProducts(currentProduct) {
    const grid = document.getElementById('related-products-grid');
    if (!grid || typeof PRODUCTS === 'undefined') return;

    let related = PRODUCTS.filter(p => p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id);
    if (related.length < 4) {
        const extra = PRODUCTS.filter(p => p.id !== currentProduct.id && !related.includes(p));
        related = [...related, ...extra].slice(0, 4);
    } else {
        related = related.slice(0, 4);
    }

    grid.innerHTML = related.map(p => renderProductCardHTML(p)).join('');
    attachProductCardEvents(grid);
}

/* ==========================================================================
   CART PAGE HANDLERS
   ========================================================================== */

function initCartPage() {
    const container = document.getElementById('cart-items-container');
    const summaryBox = document.getElementById('cart-summary-box');
    const promoInput = document.getElementById('promo-input');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoMessage = document.getElementById('promo-message');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    let appliedCode = null;

    function renderCart() {
        const totals = getCartTotals(appliedCode);

        if (totals.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-wrapper">
                    <i class="fas fa-shopping-basket text-6xl text-teal"></i>
                    <h2>Your cart is currently empty</h2>
                    <p>Explore our healthcare categories and add trusted medicines & wellness products to your cart.</p>
                    <a href="shop.html" class="btn btn-primary btn-lg mt-4">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                </div>
            `;
            if (summaryBox) summaryBox.style.display = 'none';
            return;
        }

        if (summaryBox) summaryBox.style.display = 'block';

        container.innerHTML = `
            <div class="cart-shipping-banner">
                ${totals.subtotal >= 50 ? `
                    <div class="shipping-msg free"><i class="fas fa-truck text-teal"></i> You have unlocked <strong>FREE Express Delivery!</strong></div>
                ` : `
                    <div class="shipping-msg"><i class="fas fa-info-circle text-teal"></i> Add <strong>$${(50 - totals.subtotal).toFixed(2)}</strong> more to get FREE Delivery!</div>
                `}
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${totals.freeShippingProgress}%"></div></div>
            </div>

            <div class="cart-table">
                <div class="cart-header">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                    <span>Action</span>
                </div>
                ${totals.items.map(item => `
                    <div class="cart-row" data-id="${item.id}">
                        <div class="cart-col-product">
                            <img src="${item.product.image}" alt="${item.product.name}">
                            <div class="cart-prod-details">
                                <span class="prod-cat">${item.product.category}</span>
                                <h4><a href="product.html?id=${item.product.id}">${item.product.name}</a></h4>
                            </div>
                        </div>
                        <div class="cart-col-price">$${item.product.price.toFixed(2)}</div>
                        <div class="cart-col-qty">
                            <div class="quantity-selector">
                                <button class="qty-btn js-cart-minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                                <input type="number" value="${item.quantity}" readonly>
                                <button class="qty-btn js-cart-plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="cart-col-subtotal">$${item.itemSubtotal.toFixed(2)}</div>
                        <div class="cart-col-action">
                            <button class="btn-remove js-cart-remove" data-id="${item.id}" aria-label="Remove item">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Update Summary Box
        document.getElementById('summary-subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
        document.getElementById('summary-shipping').textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
        
        const discountRow = document.getElementById('summary-discount-row');
        if (discountRow) {
            if (totals.discountAmount > 0) {
                discountRow.style.display = 'flex';
                document.getElementById('summary-discount').textContent = `-$${totals.discountAmount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        document.getElementById('summary-total').textContent = `$${totals.total.toFixed(2)}`;

        // Attach event handlers
        container.querySelectorAll('.js-cart-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = totals.items.find(i => i.id === id);
                if (item) updateQuantity(id, item.quantity - 1);
            });
        });

        container.querySelectorAll('.js-cart-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = totals.items.find(i => i.id === id);
                if (item) updateQuantity(id, item.quantity + 1);
            });
        });

        container.querySelectorAll('.js-cart-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                removeFromCart(id);
            });
        });
    }

    // Listen to storage events
    window.addEventListener('stackly-cart-updated', () => renderCart());

    // Promo Code
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (PROMO_CODES[code]) {
                appliedCode = code;
                promoMessage.className = 'promo-msg success';
                promoMessage.textContent = `Promo code "${code}" applied successfully!`;
                renderCart();
            } else {
                promoMessage.className = 'promo-msg error';
                promoMessage.textContent = 'Invalid promo code. Try "PHAR20" for 20% off!';
            }
        });
    }

    // Proceed to Checkout Modal
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', () => {
            checkoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeCheckout = document.querySelector('.checkout-modal-close');
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => {
                checkoutModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                window.location.href = '404.html';
            });
        }
    }

    renderCart();
}

/* ==========================================================================
   FORM VALIDATION & OTHER PAGES
   ========================================================================== */

function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const email = input ? input.value.trim() : '';

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Redirect to 404 page
            window.location.href = '404.html';
        });
    });
}

function initContactPage() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill out all required fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        showToast('Your message has been sent. A STACKLY representative will respond shortly.', 'success');
        form.reset();
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-question');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });
}

function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('#login-email').value.trim();
        const password = form.querySelector('#login-password').value.trim();

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        showToast('Successfully logged in! Welcome back to STACKLY.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    });
}

function initSignupPage() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#signup-name').value.trim();
        const email = form.querySelector('#signup-email').value.trim();
        const password = form.querySelector('#signup-password').value.trim();
        const confirmPassword = form.querySelector('#signup-confirm-password').value.trim();
        const terms = form.querySelector('#terms-checkbox');

        if (!name || !email || !password || !confirmPassword) {
            showToast('Please complete all mandatory fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        if (terms && !terms.checked) {
            showToast('Please agree to the Terms & Privacy Policy.', 'error');
            return;
        }

        showToast('Account created successfully! Welcome to STACKLY.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    });
}

function initQuickViewModal() {
    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-view-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <button class="modal-close-btn" aria-label="Close">&times;</button>
                <div id="quick-view-content"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function openQuickView(productId) {
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;

    if (!modal || !content || !product) return;

    content.innerHTML = `
        <div class="quick-view-grid">
            <img src="${product.image}" alt="${product.name}">
            <div class="quick-view-info">
                <span class="product-category">${product.category}</span>
                <h2>${product.name}</h2>
                <div class="detail-price-box">
                    <span class="detail-current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="detail-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <p>${product.shortDesc}</p>
                <div class="quick-view-actions">
                    <button class="btn btn-primary" id="qv-add-cart">Add to Cart</button>
                    <a href="404.html" class="btn btn-outline">Full Details</a>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('qv-add-cart').addEventListener('click', () => {
        addToCart(product.id, 1);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

