/**
 * STACKLY - Customer Dashboard Engine & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomerNavigation();
    initMobileCustomerSidebar();
    syncCustomerMetrics();
    initCustomerCounters();
    initCustomerModals();
    initCustomerProfileForm();
});

/* ==========================================================================
   CUSTOMER SIDEBAR & SECTION SWITCHER
   ========================================================================== */

function initCustomerNavigation() {
    const sidebarItems = document.querySelectorAll('.cust-sidebar-item[data-section]');
    const sections = document.querySelectorAll('.cust-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');

            if (targetSection === 'logout') {
                handleCustomerLogout();
                return;
            }

            // Update Active Sidebar Item
            sidebarItems.forEach(s => s.classList.remove('active'));
            item.classList.add('active');

            // Update Active Section
            sections.forEach(sec => sec.classList.remove('active'));
            const activeSec = document.getElementById(`cust-section-${targetSection}`);
            if (activeSec) {
                activeSec.classList.add('active');
            }

            // Close Mobile Sidebar if open
            closeMobileCustomerSidebar();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle hash navigation
    if (window.location.hash) {
        const hashSection = window.location.hash.substring(1);
        const targetNav = document.querySelector(`.cust-sidebar-item[data-section="${hashSection}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }
}

function handleCustomerLogout() {
    window.location.href = 'login.html';
}

/* ==========================================================================
   MOBILE SIDEBAR OVERLAY
   ========================================================================== */

function initMobileCustomerSidebar() {
    const toggleBtn = document.getElementById('cust-mobile-toggle');
    const sidebar = document.getElementById('customer-sidebar');
    const closeBtn = document.getElementById('cust-sidebar-close');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            closeMobileCustomerSidebar();
        });
    }
}

function closeMobileCustomerSidebar() {
    const sidebar = document.getElementById('customer-sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   METRICS & LOCALSTORAGE SYNC
   ========================================================================== */

function syncCustomerMetrics() {
    // Sync Wishlist Count
    try {
        const storedWish = localStorage.getItem('stackly_wishlist');
        const wishlist = storedWish ? JSON.parse(storedWish) : [];
        const wishStatNum = document.getElementById('cust-wish-count');
        if (wishStatNum) {
            wishStatNum.setAttribute('data-target', wishlist.length || 8);
        }
    } catch (e) {}

    // Sync Cart Badge
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}


/* ==========================================================================
   GSAP COUNT-UP ANIMATIONS
   ========================================================================== */

function initCustomerCounters() {
    const counters = document.querySelectorAll('.js-cust-counter');
    if (counters.length === 0) return;

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));

        if (typeof gsap !== 'undefined') {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => {
                    if (target > 999) {
                        counter.textContent = Math.floor(obj.val).toLocaleString();
                    } else {
                        counter.textContent = Math.floor(obj.val);
                    }
                }
            });
        } else {
            counter.textContent = target.toLocaleString();
        }
    });
}

/* ==========================================================================
   MODAL HANDLERS (PROFILE & PRESCRIPTION UPLOAD)
   ========================================================================== */

function initCustomerModals() {
    // Upload Prescription Action
    const rxUploadBtns = document.querySelectorAll('.js-upload-rx-btn');
    rxUploadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('rx-upload-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const rxModalClose = document.querySelector('.rx-modal-close');
    if (rxModalClose) {
        rxModalClose.addEventListener('click', () => {
            const modal = document.getElementById('rx-upload-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    const rxForm = document.getElementById('rx-upload-form');
    if (rxForm) {
        rxForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Prescription uploaded successfully! Pharmacist verifying...', 'success');
            const modal = document.getElementById('rx-upload-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            rxForm.reset();
        });
    }
}

function initCustomerProfileForm() {
    const editBtn = document.getElementById('cust-edit-profile-btn');
    const profileModal = document.getElementById('profile-edit-modal');
    const profileClose = document.querySelector('.profile-modal-close');
    const profileForm = document.getElementById('profile-edit-form');

    if (editBtn && profileModal) {
        editBtn.addEventListener('click', () => {
            profileModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (profileClose && profileModal) {
        profileClose.addEventListener('click', () => {
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('edit-name').value.trim();
            const emailVal = document.getElementById('edit-email').value.trim();
            const phoneVal = document.getElementById('edit-phone').value.trim();

            if (nameVal) document.getElementById('cust-display-name').textContent = nameVal;
            if (emailVal) document.getElementById('cust-display-email').textContent = emailVal;
            if (phoneVal) document.getElementById('cust-display-phone').textContent = phoneVal;

            showToast('Profile information updated successfully!', 'success');
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}
