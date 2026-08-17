/**
 * STACKLY - Sticky Header, Mobile Drawer Navigation & Global Search Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initActivePageLink();
    initMobileMenu();
    initHeaderSearch();
});

function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

function initActivePageLink() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const pageName = href.split('/').pop();
        if (pageName === currentPath || (currentPath === '' && pageName === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !mobileNav || !drawer) return;

    // Remove conflicting GSAP inline styles on mobile nav elements
    gsap.set(mobileNav, { clearProps: "all" });
    gsap.set(drawer, { clearProps: "all" });

    let isMenuOpen = false;

    const openMenu = () => {
        if (isMenuOpen) return;
        isMenuOpen = true;
        document.body.classList.add('no-scroll');
        toggleBtn.setAttribute('aria-expanded', 'true');
        
        // Hamburger animation to X
        if (toggleIcon) {
            gsap.to(toggleIcon, { rotation: 90, opacity: 0, duration: 0.2, onComplete: () => {
                toggleIcon.className = 'fas fa-times';
                gsap.fromTo(toggleIcon, { rotation: -90, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.2 });
            }});
        }

        mobileNav.classList.add('active');
    };

    const closeMenu = () => {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        document.body.classList.remove('no-scroll');
        toggleBtn.setAttribute('aria-expanded', 'false');

        // X animation back to Hamburger
        if (toggleIcon) {
            gsap.to(toggleIcon, { rotation: -90, opacity: 0, duration: 0.2, onComplete: () => {
                toggleIcon.className = 'fas fa-bars';
                gsap.fromTo(toggleIcon, { rotation: 90, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.2 });
            }});
        }

        mobileNav.classList.remove('active');
    };

    toggleBtn.addEventListener('click', () => {
        if (isMenuOpen) closeMenu();
        else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

function initHeaderSearch() {
    const searchBtns = document.querySelectorAll('.js-open-search');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.querySelector('.search-modal-close');
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('global-search-results');

    if (!searchModal) return;

    const openSearch = () => {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    };

    const closeSearch = () => {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    searchBtns.forEach(btn => btn.addEventListener('click', openSearch));
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
    });

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                searchResults.innerHTML = '<div class="search-placeholder"><i class="fas fa-search"></i><p>Type at least 2 characters to search products...</p></div>';
                return;
            }

            if (typeof searchProducts === 'function') {
                const matches = searchProducts(query).slice(0, 5);
                if (matches.length === 0) {
                    searchResults.innerHTML = '<div class="search-placeholder"><i class="fas fa-box-open"></i><p>No healthcare products found matching your term.</p></div>';
                    return;
                }

                searchResults.innerHTML = matches.map(p => `
                    <a href="product.html?id=${p.id}" class="search-result-item">
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                        <div class="search-result-info">
                            <span class="search-result-category">${p.category}</span>
                            <h4 class="search-result-title">${p.name}</h4>
                            <span class="search-result-price">$${p.price.toFixed(2)}</span>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                `).join('');
            }
        });
    }
}
