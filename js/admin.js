/**
 * STACKLY - Admin Dashboard Engine & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdminNavigation();
    initMobileSidebar();
    initProfileDropdown();
    initNotificationDrawer();
    initAdminChart();
    initAdminCounters();
    initAdminSearchFilter();
    initFormInteractions();
});

/* ==========================================================================
   SIDEBAR NAVIGATION & SECTION SWITCHER
   ========================================================================== */

function initAdminNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('admin-page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');

            if (targetSection === 'logout') {
                handleLogout();
                return;
            }

            // Update Active Nav Item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update Active Section
            sections.forEach(sec => sec.classList.remove('active'));
            const activeSec = document.getElementById(`section-${targetSection}`);
            if (activeSec) {
                activeSec.classList.add('active');
            }

            // Update Header Title
            const sectionName = item.textContent.trim();
            if (pageTitle) pageTitle.textContent = sectionName;

            // Close Mobile Sidebar if open
            closeMobileSidebar();
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Refresh Chart if switching back to Dashboard
            if (targetSection === 'dashboard') {
                initAdminChart();
            }
        });
    });

    // Handle hash navigation
    if (window.location.hash) {
        const hashSection = window.location.hash.substring(1);
        const targetNav = document.querySelector(`.admin-nav-item[data-section="${hashSection}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }
}

function handleLogout() {
    window.location.href = 'login.html';
}


/* ==========================================================================
   MOBILE SIDEBAR OVERLAY HANDLER
   ========================================================================== */

function initMobileSidebar() {
    const toggleBtn = document.getElementById('admin-mobile-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const closeBtn = document.getElementById('admin-sidebar-close');
    const overlay = document.querySelector('.admin-sidebar-overlay');

    if (!toggleBtn || !sidebar) return;

    let isSidebarOpen = false;

    const openMobileSidebar = () => {
        if (isSidebarOpen) return;
        isSidebarOpen = true;
        document.body.style.overflow = 'hidden';
        sidebar.classList.add('active');
        if (overlay) {
            overlay.classList.add('active');
            gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
    };

    const closeMobileSidebar = () => {
        if (!isSidebarOpen) return;
        isSidebarOpen = false;
        document.body.style.overflow = '';
        sidebar.classList.remove('active');
        if (overlay) {
            gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => {
                overlay.classList.remove('active');
            }});
        }
    };

    // Expose globally so navigation can close it
    window.closeMobileSidebar = closeMobileSidebar;

    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
            if (isSidebarOpen) closeMobileSidebar();
            else openMobileSidebar();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);
    if (overlay) overlay.addEventListener('click', closeMobileSidebar);
}

/* ==========================================================================
   PROFILE DROPDOWN & NOTIFICATION DRAWER
   ========================================================================== */

function initProfileDropdown() {
    const btn = document.getElementById('admin-profile-btn');
    const menu = document.getElementById('admin-profile-dropdown');

    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }
}

function initNotificationDrawer() {
    const notifBtn = document.getElementById('admin-notif-btn');
    if (!notifBtn) return;

    notifBtn.addEventListener('click', () => {
        alert('🔔 Notifications Center:\n• 3 Prescriptions awaiting verification\n• 2 Low-Stock items detected (Digital Oximeter & Vitamin D3)\n• 12 Orders pending processing');
    });
}

/* ==========================================================================
   REVENUE CHART (CHART.JS INTEGRATION)
   ========================================================================== */

let revenueChartInstance = null;

function initAdminChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    const dataWeekly = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [1200, 1900, 1500, 2800, 2400, 3200, 2900]
    };

    const dataMonthly = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [11200, 14800, 12900, 16100]
    };

    const dataYearly = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [32000, 38000, 42000, 48000, 45000, 52000, 58000, 62000, 60000, 68000, 74000, 82000]
    };

    let activeData = dataWeekly;

    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: activeData.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: activeData.data,
                borderColor: '#087F8C',
                backgroundColor: 'rgba(8, 127, 140, 0.08)',
                borderWidth: 3,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#0B4F6C',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#627D98' }
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#627D98',
                        callback: (val) => `$${val}`
                    }
                }
            }
        }
    });

    // Chart Timeframe Selector Handler
    const filterBtns = document.querySelectorAll('.chart-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('btn-primary'));
            filterBtns.forEach(b => b.classList.add('btn-outline'));
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');

            const timeframe = btn.getAttribute('data-chart');
            if (timeframe === 'monthly') activeData = dataMonthly;
            else if (timeframe === 'yearly') activeData = dataYearly;
            else activeData = dataWeekly;

            revenueChartInstance.data.labels = activeData.labels;
            revenueChartInstance.data.datasets[0].data = activeData.data;
            revenueChartInstance.update();
        });
    });
}

/* ==========================================================================
   GSAP COUNTER ANIMATION FOR STATS
   ========================================================================== */

function initAdminCounters() {
    const counters = document.querySelectorAll('.js-admin-counter');
    if (counters.length === 0) return;

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';

        if (typeof gsap !== 'undefined') {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    if (target > 1000) {
                        counter.textContent = `${prefix}${Math.floor(obj.val).toLocaleString()}${suffix}`;
                    } else {
                        counter.textContent = `${prefix}${Math.floor(obj.val)}${suffix}`;
                    }
                }
            });
        } else {
            counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
    });
}

/* ==========================================================================
   GLOBAL SEARCH & TABLE FILTER
   ========================================================================== */

function initAdminSearchFilter() {
    const searchInput = document.getElementById('admin-global-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const activeSection = document.querySelector('.admin-section.active');
        if (!activeSection) return;

        const tableRows = activeSection.querySelectorAll('.admin-table tbody tr');
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

function initFormInteractions() {
    // Inventory action button
    const invBtns = document.querySelectorAll('.js-manage-inv');
    invBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const navInv = document.querySelector('.admin-nav-item[data-section="inventory"]');
            if (navInv) navInv.click();
        });
    });

    // Prescription action button
    const rxBtns = document.querySelectorAll('.js-review-rx');
    rxBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const navRx = document.querySelector('.admin-nav-item[data-section="prescriptions"]');
            if (navRx) navRx.click();
        });
    });
}
