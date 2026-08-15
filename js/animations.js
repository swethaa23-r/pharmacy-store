/* ==========================================================================
   STACKLY PREMIUM GSAP ANIMATIONS
   ========================================================================== */

let isReducedMotion = false;
let isMobile = window.innerWidth <= 768;

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    initReducedMotion();
    initNavbarAnimation();
    
    
    // Check if we are on the homepage (hero section exists)
    const isHomepage = document.querySelector('.hero-section') !== null;
    const hasPreloader = document.getElementById('gsap-preloader') !== null;
    
    if (isHomepage) {
        initCursorGlow();
        initTrustCards();
        
        if (!hasPreloader) {
            initHeroAnimation();
            initFloatingBadges();
        }
        // If there's a preloader, initPreloader will trigger these when it completes.
    } else {
        // Fallback for non-homepage heroes
        if (!hasPreloader) {
            initFallbackHero();
        }
    }
    
    if (!hasPreloader) {
        initScrollAnimations();
    }
    
    // Handle preloader
    initPreloader(isHomepage);
});

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

function initReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', () => {
        isReducedMotion = mediaQuery.matches;
    });
}

function initNavbarAnimation() {
    if (typeof gsap === 'undefined') return;
    const navbar = document.querySelector('.site-header');
    if (navbar) {
        // Slide down entrance
        gsap.fromTo(navbar, 
            { y: '-100%', opacity: 0 }, 
            { y: '0%', opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
        
        // Login button subtle scale
        const loginBtn = document.querySelector('.header-actions .btn-primary');
        if (loginBtn && !isMobile) {
            loginBtn.addEventListener('mouseenter', () => gsap.to(loginBtn, { scale: 1.05, filter: 'brightness(1.1)', duration: 0.3 }));
            loginBtn.addEventListener('mouseleave', () => gsap.to(loginBtn, { scale: 1, filter: 'brightness(1)', duration: 0.3 }));
        }
        
        // Cart icon interaction
        const cartIcon = document.querySelector('.icon-action-btn');
        if (cartIcon && !isMobile) {
            cartIcon.addEventListener('mouseenter', () => gsap.to(cartIcon, { y: -3, duration: 0.2, ease: 'power2.out' }));
            cartIcon.addEventListener('mouseleave', () => gsap.to(cartIcon, { y: 0, duration: 0.2, ease: 'power2.out' }));
        }
    }
}

// Utility to wrap lines/words for GSAP reveal
function wrapLines(element) {
    if (!element) return;
    
    element.innerHTML = element.innerHTML.replace(/(<[^>]+>)|([^<>\s]+(\s+|$))/g, function(match, p1, p2) {
        if (p1) return p1; // return HTML tags untouched
        return `<span class="line-wrap"><span class="line-inner">${p2}</span></span>`;
    });
    
    return element.querySelectorAll('.line-inner');
}

function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    
    const heroTitle = document.querySelector('.hero-title');
    const titleLines = wrapLines(heroTitle);
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Set initial states
    gsap.set('.hero-badge', { opacity: 0, y: 20 });
    if(titleLines && titleLines.length) gsap.set(titleLines, { y: '110%' });
    gsap.set('.hero-desc', { opacity: 0, y: 20 });
    gsap.set('.hero-actions .btn', { opacity: 0, y: 15 });
    gsap.set('.hero-image-wrapper img', { opacity: 0, scale: 0.88, y: 30 });
    gsap.set('.floating-badge', { opacity: 0 });
    
    // Sequence
    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, 0.5)
    
    if (titleLines && titleLines.length) {
        tl.to(titleLines, { y: '0%', duration: 1, stagger: 0.04, ease: 'power4.out' }, "-=0.4");
    }
    
    tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to('.hero-actions .btn', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.5")
      .to('.hero-image-wrapper img', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }, "-=1.0")
      .to('.badge-pos-1', { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, "-=0.4")
      .to('.badge-pos-3', { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, "-=0.3")
      .to('.badge-pos-2', { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out(1.5)',
          onComplete: () => {
              if (!isReducedMotion) {
                  // Hero Image Breathing Animation
                  gsap.to('.hero-image-wrapper img', {
                      scale: 1.02,
                      y: -10,
                      duration: 4,
                      repeat: -1,
                      yoyo: true,
                      ease: 'sine.inOut'
                  });
              }
          }
      }, "-=0.3");
}

function initFallbackHero() {
    if (typeof gsap === 'undefined') return;
    
    const pageHeroes = document.querySelectorAll('.page-hero');
    pageHeroes.forEach(hero => {
        // Overlay reveal
        gsap.fromTo(hero, 
            { backgroundPosition: '50% 100%' }, 
            { backgroundPosition: '50% 50%', duration: 2, ease: 'power2.out' }
        );

        // Heading animation
        const heading = hero.querySelector('h1, h2, .page-title, .hero-title');
        if (heading) {
            const titleLines = wrapLines(heading);
            if (titleLines && titleLines.length) {
                gsap.set(titleLines, { y: '110%' });
                gsap.to(titleLines, { y: '0%', duration: 1, stagger: 0.04, ease: 'power4.out', delay: 0.2 });
            }
        }

        // Standard fade-up for other children in the hero
        const children = hero.querySelectorAll('.hero-content > *:not(h1):not(h2):not(.page-title):not(.hero-title), .container > *:not(h1):not(h2):not(.page-title):not(.hero-title)');
        if (children.length > 0) {
            gsap.fromTo(children, 
                { opacity: 0, y: 40 }, 
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.4 }
            );
        }

        // Subtle slow zoom effect for overlays
        const overlays = hero.querySelectorAll('.page-hero-overlay');
        if (overlays.length > 0 && !isReducedMotion) {
            gsap.to(overlays, {
                scale: 1.05,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });
}

function initFloatingBadges() {
    if (typeof gsap === 'undefined' || isReducedMotion || isMobile) return;
    
    // Wait slightly to not interfere with entrance animation
    setTimeout(() => {
        gsap.to('.badge-pos-1', {
            y: "-=8",
            rotation: 1,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            willChange: 'transform'
        });
        
        gsap.to('.badge-pos-2', {
            x: "+=5",
            y: "+=6",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            willChange: 'transform'
        });
        
        gsap.to('.badge-pos-3', {
            x: "-=5",
            y: "-=8",
            rotation: -1,
            duration: 3.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            willChange: 'transform'
        });
    }, 3000);
}

function initCursorGlow() {
    if (isMobile || isReducedMotion) return;
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const glow = document.createElement('div');
    glow.className = 'hero-glow';
    heroSection.appendChild(glow);
    
    gsap.to(glow, { opacity: 1, duration: 1, delay: 1 });
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    gsap.ticker.add(() => {
        gsap.to(glow, {
            x: mouseX - 300, // offset half width
            y: mouseY - 300, // offset half height
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

function initTrustCards() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const cards = document.querySelectorAll('.trust-strip-section .trust-card');
    if (!cards.length) return;
    
    gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
            scrollTrigger: {
                trigger: '.trust-strip-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }
    );
    
    // Subtle icon pop
    cards.forEach(card => {
        const icon = card.querySelector('.trust-icon i');
        if (icon) {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.fromTo(icon, 
                        { scale: 0.5, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.2 }
                    );
                }
            });
        }
    });
}


function initProductsGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const grids = document.querySelectorAll('.products-grid');
    if (!grids.length) return;

    const isMobile = window.innerWidth < 768;

    grids.forEach(grid => {
        let bgGlow = grid.parentElement.querySelector('.products-bg-glow');
        if (!bgGlow) {
            bgGlow = document.createElement('div');
            bgGlow.className = 'products-bg-glow';
            bgGlow.style.position = 'absolute';
            bgGlow.style.top = '0';
            bgGlow.style.left = '0';
            bgGlow.style.width = '100%';
            bgGlow.style.height = '100%';
            bgGlow.style.background = 'radial-gradient(circle at center, rgba(14, 165, 233, 0.035) 0%, rgba(255,255,255,0) 65%)';
            bgGlow.style.zIndex = '0';
            bgGlow.style.pointerEvents = 'none';

            const section = grid.closest('.section-padding') || grid.parentElement;
            if (getComputedStyle(section).position === 'static') {
                section.style.position = 'relative';
            }
            
            const container = section.querySelector('.container');
            if (container) {
                container.style.position = 'relative';
                container.style.zIndex = '1';
            }

            section.insertBefore(bgGlow, section.firstChild);

            gsap.fromTo(bgGlow,
                { x: '-8%' },
                { x: '8%', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' }
            );
            
            for(let i=0; i<4; i++) {
                const dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.width = (Math.random() * 8 + 4) + 'px';
                dot.style.height = dot.style.width;
                dot.style.borderRadius = '50%';
                dot.style.background = 'rgba(14, 165, 233, 0.15)';
                dot.style.left = (Math.random() * 90 + 5) + '%';
                dot.style.top = (Math.random() * 90 + 5) + '%';
                dot.style.zIndex = '0';
                dot.style.pointerEvents = 'none';
                section.insertBefore(dot, section.firstChild);
                
                gsap.to(dot, {
                    y: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 5),
                    x: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 5),
                    duration: 3 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        }

        const cards = grid.querySelectorAll('.product-card');
        if (!cards.length) return;

        ScrollTrigger.create({
            trigger: grid,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const yStart = isMobile ? 25 : 50;
                const scaleStart = isMobile ? 0.98 : 0.96;

                const tl = gsap.timeline();

                gsap.set(cards, { opacity: 0, y: yStart, scale: scaleStart });
                
                cards.forEach(card => {
                    const img = card.querySelector('.product-image-box img');
                    if (img) gsap.set(img, { opacity: 0, scale: 1.08, clipPath: 'inset(100% 0 0 0)' });
                    
                    const els = ['.product-overlay-actions', '.product-category', '.product-name', '.product-rating', '.product-price-row', '.product-card-actions'];
                    els.forEach(selector => {
                        const el = card.querySelector(selector);
                        if (el) gsap.set(el, { opacity: 0 });
                    });
                });

                tl.to(cards, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.65,
                    ease: 'power3.out',
                    stagger: 0.10
                });

                cards.forEach((card, index) => {
                    const cardTl = gsap.timeline();
                    const startTime = index * 0.10 + 0.2;
                    
                    const img = card.querySelector('.product-image-box img');
                    if (img) {
                        cardTl.to(img, {
                            opacity: 1,
                            scale: 1,
                            clipPath: 'inset(0% 0 0 0)',
                            duration: 0.7,
                            ease: 'power2.out'
                        }, startTime);
                    }

                    const actions = card.querySelector('.product-overlay-actions');
                    if (actions) {
                        cardTl.to(actions, { opacity: 1, duration: 0.4 }, "-=0.3");
                    }

                    const staggerEls = ['.product-category', '.product-name', '.product-rating', '.product-price-row', '.product-card-actions'];
                    staggerEls.forEach(selector => {
                        const el = card.querySelector(selector);
                        if (el) {
                            cardTl.to(el, { opacity: 1, duration: 0.3 }, "+=0.05");
                        }
                    });
                });
            }
        });
    });

    if (typeof window.attachProductCardHover === 'function') {
        window.attachProductCardHover();
    }
}

window.attachProductCardHover = function() {
    if (typeof gsap === 'undefined') return;
    
    const isMobile = window.innerWidth < 768;
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        if (card.dataset.hoverAttached) return;
        card.dataset.hoverAttached = 'true';
        
        const img = card.querySelector('.product-image-box img');
        const actions = card.querySelectorAll('.product-overlay-actions .action-btn');
        const btnCart = card.querySelector('.js-add-cart');
        const btnBuy = card.querySelector('.js-buy-now');
        
        if (window.matchMedia('(hover: hover)').matches && !isMobile) {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { 
                    y: -7, 
                    scale: 1.015, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    boxShadow: '0 15px 35px rgba(14, 165, 233, 0.12)',
                    borderColor: 'rgba(14, 165, 233, 0.25)'
                });
                
                if (img) gsap.to(img, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
                if (actions.length) gsap.to(actions, { scale: 1.08, y: -2, duration: 0.3, stagger: 0.05, ease: 'power2.out' });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { 
                    y: 0, 
                    scale: 1, 
                    duration: 0.4, 
                    ease: 'power2.out',
                    boxShadow: '0 2px 8px rgba(11, 79, 108, 0.05)',
                    borderColor: 'transparent'
                });
                
                if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                if (actions.length) gsap.to(actions, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
            });
            
            if (btnCart) {
                btnCart.addEventListener('mouseenter', () => {
                    const icon = btnCart.querySelector('i');
                    if (icon) gsap.to(icon, { x: 4, duration: 0.2, ease: 'power2.out' });
                    gsap.to(btnCart, { y: -2, duration: 0.2, ease: 'power2.out' });
                });
                btnCart.addEventListener('mouseleave', () => {
                    const icon = btnCart.querySelector('i');
                    if (icon) gsap.to(icon, { x: 0, duration: 0.2, ease: 'power2.out' });
                    gsap.to(btnCart, { y: 0, duration: 0.2, ease: 'power2.out' });
                });
            }

            if (btnBuy) {
                btnBuy.addEventListener('mouseenter', () => {
                    gsap.to(btnBuy, { scale: 1.04, duration: 0.25, ease: 'power2.out', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)' });
                });
                btnBuy.addEventListener('mouseleave', () => {
                    gsap.to(btnBuy, { scale: 1, duration: 0.25, ease: 'power2.out', boxShadow: 'none' });
                });
            }
        }

        if (btnCart) {
            btnCart.addEventListener('click', () => {
                gsap.fromTo(btnCart, 
                    { scale: 0.96 }, 
                    { scale: 1, duration: 0.3, ease: 'back.out(2)' }
                );
                
                const icon = btnCart.querySelector('i');
                const headerCart = document.querySelector('.fa-shopping-cart') || document.querySelector('.header-cart i');
                if (icon && headerCart) {
                    const iconRect = icon.getBoundingClientRect();
                    const targetRect = headerCart.getBoundingClientRect();
                    
                    const flyingIcon = icon.cloneNode(true);
                    flyingIcon.style.position = 'fixed';
                    flyingIcon.style.left = iconRect.left + 'px';
                    flyingIcon.style.top = iconRect.top + 'px';
                    flyingIcon.style.zIndex = 9999;
                    flyingIcon.style.color = 'var(--teal)';
                    flyingIcon.style.pointerEvents = 'none';
                    document.body.appendChild(flyingIcon);
                    
                    gsap.to(flyingIcon, {
                        x: targetRect.left - iconRect.left,
                        y: targetRect.top - iconRect.top,
                        scale: 0.5,
                        opacity: 0.5,
                        duration: 0.6,
                        ease: 'power2.in',
                        onComplete: () => flyingIcon.remove()
                    });
                }
            });
        }
    });
}



function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const mv = (val) => isMobile ? val * 0.4 : (isTablet ? val * 0.75 : val);

    // 1. TESTIMONIALS SECTION
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        const header = testimonialsSection.querySelector('.section-header');
        const heading = header ? header.querySelector('.section-title') : null;
        const subtitle = header ? header.querySelector('.section-subtitle') : null;
        const cards = testimonialsSection.querySelectorAll('.testimonial-card');

        const tlTestimonials = gsap.timeline({
            scrollTrigger: {
                trigger: testimonialsSection,
                start: 'top 80%',
                once: true
            }
        });

        if (heading) {
            tlTestimonials.fromTo(heading, 
                { opacity: 0, y: mv(35), scale: 0.97 }, 
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
            );
        }
        if (subtitle) {
            tlTestimonials.fromTo(subtitle, 
                { opacity: 0, y: mv(20) }, 
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                "<0.15"
            );
        }

        if (cards.length > 0) {
            tlTestimonials.fromTo(cards,
                { opacity: 0, y: mv(45), scale: 0.94, rotationY: 8 },
                { opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' },
                "-=0.4"
            );

            cards.forEach((card, i) => {
                const stars = card.querySelectorAll('.fa-star');
                const avatar = card.querySelector('.author-avatar');
                const verified = card.querySelector('.author-info span');
                const quote = card.querySelector('.testimonial-quote');

                const delay = 0.8 + (i * 0.15); 
                
                if (stars.length) tlTestimonials.fromTo(stars, { opacity: 0, scale: 0.5, y: 5 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }, delay);
                if (avatar) tlTestimonials.fromTo(avatar, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, delay + 0.1);
                if (verified) tlTestimonials.fromTo(verified, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, delay + 0.2);
                if (quote) tlTestimonials.fromTo(quote, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, delay + 0.1);

                let floatTween;
                setTimeout(() => {
                    floatTween = gsap.fromTo(card, 
                        { y: 0 }, 
                        { y: -3, duration: 3 + Math.random(), repeat: -1, yoyo: true, ease: 'sine.inOut' }
                    );
                }, 2000 + i * 200);

                if (!isMobile && window.matchMedia('(hover: hover)').matches) {
                    card.addEventListener('mouseenter', () => {
                        if (floatTween) floatTween.pause();
                        gsap.to(card, { y: -8, scale: 1.02, duration: 0.3, boxShadow: '0 12px 30px rgba(14, 165, 233, 0.15)', ease: 'power2.out', overwrite: 'auto' });
                        if (avatar) gsap.to(avatar, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, scale: 1, duration: 0.3, boxShadow: 'none', ease: 'power2.out', overwrite: 'auto', onComplete: () => {
                            if (floatTween) floatTween.restart();
                        }});
                        if (avatar) gsap.to(avatar, { scale: 1, duration: 0.3, ease: 'power2.out' });
                    });
                }
            });
        }
    }

    // 2. NEWSLETTER SECTION
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
        const container = newsletterSection.querySelector('.newsletter-card');
        const heading = newsletterSection.querySelector('h2');
        const p = newsletterSection.querySelector('p');
        const input = newsletterSection.querySelector('input');
        const btn = newsletterSection.querySelector('.btn');

        if (container) {
            const glow = document.createElement('div');
            glow.style.position = 'absolute';
            glow.style.top = '0';
            glow.style.left = '-100%';
            glow.style.width = '100%';
            glow.style.height = '100%';
            glow.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)';
            glow.style.zIndex = '0';
            glow.style.pointerEvents = 'none';
            if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
            container.style.overflow = 'hidden';
            
            Array.from(container.children).forEach(child => {
                if (getComputedStyle(child).position === 'static') child.style.position = 'relative';
                child.style.zIndex = '1';
            });
            container.insertBefore(glow, container.firstChild);

            gsap.to(glow, { left: '100%', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });

            const tlNews = gsap.timeline({ scrollTrigger: { trigger: newsletterSection, start: 'top 80%', once: true } });

            tlNews.fromTo(container, { opacity: 0, y: mv(45), scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' });
            if (heading) tlNews.fromTo(heading, { opacity: 0, x: mv(-25) }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, "-=0.3");
            if (p) tlNews.fromTo(p, { opacity: 0, x: mv(-20) }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, "-=0.4");
            if (input) tlNews.fromTo(input, { opacity: 0, x: mv(25) }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, "-=0.5");
            if (btn) tlNews.fromTo(btn, { opacity: 0, x: mv(25), scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, "-=0.5");

            if (!isMobile && btn && window.matchMedia('(hover: hover)').matches) {
                btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, y: -2, boxShadow: '0 4px 15px rgba(255,255,255,0.2)', duration: 0.25 }));
                btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, y: 0, boxShadow: 'none', duration: 0.25 }));
                btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.96, duration: 0.1 }));
                btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.04, duration: 0.1 }));
            }

            if (input) {
                input.addEventListener('focus', () => gsap.to(input, { borderColor: '#0ea5e9', boxShadow: '0 0 0 3px rgba(14,165,233,0.2)', scale: 1.01, duration: 0.25 }));
                input.addEventListener('blur', () => gsap.to(input, { borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'none', scale: 1, duration: 0.25 }));
            }
        }
    }

    // 3. FOOTER
    const footer = document.querySelector('.site-footer');
    if (footer) {
        const footerGlow = document.createElement('div');
        footerGlow.style.position = 'absolute';
        footerGlow.style.top = '0';
        footerGlow.style.left = '0';
        footerGlow.style.width = '0%';
        footerGlow.style.height = '1px';
        footerGlow.style.background = 'linear-gradient(90deg, rgba(14,165,233,0.1), rgba(14,165,233,0.8), rgba(14,165,233,0.1))';
        footerGlow.style.boxShadow = '0 0 10px rgba(14,165,233,0.3)';
        if (getComputedStyle(footer).position === 'static') footer.style.position = 'relative';
        footer.insertBefore(footerGlow, footer.firstChild);

        const tlFooter = gsap.timeline({ scrollTrigger: { trigger: footer, start: 'top 80%', once: true } });

        tlFooter.fromTo(footer, { opacity: 0, y: mv(30) }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        tlFooter.to(footerGlow, { width: '100%', duration: 1.5, ease: 'power2.out' }, "-=0.5");

        const footerCols = footer.querySelectorAll('.footer-brand, .footer-col');
        if (footerCols.length) tlFooter.fromTo(footerCols, { opacity: 0, y: mv(20) }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, "-=0.6");

        const socialIcons = footer.querySelectorAll('.social-btn');
        if (socialIcons.length) {
            tlFooter.fromTo(socialIcons, { opacity: 0, scale: 0.7, y: mv(10) }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.5)' }, "-=0.4");
            if (!isMobile && window.matchMedia('(hover: hover)').matches) {
                socialIcons.forEach(icon => {
                    icon.addEventListener('mouseenter', () => gsap.to(icon, { scale: 1.12, y: -3, duration: 0.25 }));
                    icon.addEventListener('mouseleave', () => gsap.to(icon, { scale: 1, y: 0, duration: 0.25 }));
                });
            }
        }

        if (!isMobile && window.matchMedia('(hover: hover)').matches) {
            const footerLinks = footer.querySelectorAll('.footer-links a');
            footerLinks.forEach(link => {
                link.addEventListener('mouseenter', () => gsap.to(link, { x: 4, color: '#0ea5e9', duration: 0.2 }));
                link.addEventListener('mouseleave', () => gsap.to(link, { x: 0, color: '', duration: 0.2 }));
            });
        }
    }
}

function initPreloader(isHomepage) {
    window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') {
            const preloader = document.getElementById('gsap-preloader');
            if (!preloader) return;
            
            document.body.style.overflow = 'hidden';
            
            const tl = gsap.timeline({
                onComplete: () => {
                    preloader.remove();
                    document.body.style.overflow = '';
                    if (isHomepage) {
                        initHeroAnimation();
                        initFloatingBadges();
                    } else {
                        initFallbackHero();
                    }
                    initScrollAnimations();
                    initHealthCategoriesGSAP();
                    initProductsGSAP();
                    initStoryAnimations();
                }
            });
            
            gsap.set('.gsap-pill', { y: -150, opacity: 0, rotation: -45 });
            
            tl.to('.gsap-pill', { y: 0, opacity: 1, rotation: 0, duration: 1.2, ease: "bounce.out" })
              .to('.gsap-brand', { opacity: 1, y: -10, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .to('.gsap-pill', { y: -15, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, "-=0.6")
              .to('.gsap-pill-left', { x: -50, opacity: 0, duration: 0.6, ease: "power3.in" })
              .to('.gsap-pill-right', { x: 50, opacity: 0, duration: 0.6, ease: "power3.in" }, "<")
              .to('.gsap-brand', { opacity: 0, scale: 1.2, duration: 0.4, ease: "power2.in" }, "-=0.3")
              .to('.gsap-curtain', { scaleY: 0, duration: 0.8, ease: "power4.inOut" });
        }
    });

    setTimeout(() => {
        const preloader = document.getElementById('gsap-preloader');
        if (preloader) {
            preloader.remove();
            document.body.style.overflow = '';
            if (isHomepage && typeof initHeroAnimation !== 'undefined') {
                initHeroAnimation();
                initFloatingBadges();
            } else if (!isHomepage && typeof initFallbackHero !== 'undefined') {
                initFallbackHero();
            }
            if (typeof initScrollAnimations !== 'undefined') {
                initScrollAnimations();
                initHealthCategoriesGSAP();
                initProductsGSAP();
                initStoryAnimations();
            }
        }
    }, 6000);
}


function initHealthCategoriesGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const categoriesSection = document.querySelector('.categories-grid');
    if (!categoriesSection) return;

    const section = categoriesSection.closest('.section-padding');
    const heading = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const cards = categoriesSection.querySelectorAll('.category-card');

    // 8. Background effect
    const bgGlow = document.createElement('div');
    bgGlow.style.position = 'absolute';
    bgGlow.style.top = '0';
    bgGlow.style.left = '0';
    bgGlow.style.width = '100%';
    bgGlow.style.height = '100%';
    bgGlow.style.background = 'radial-gradient(circle at center, rgba(14, 165, 233, 0.04) 0%, rgba(255,255,255,0) 70%)';
    bgGlow.style.zIndex = '0';
    bgGlow.style.pointerEvents = 'none';
    
    if (getComputedStyle(section).position === 'static') {
        section.style.position = 'relative';
    }
    
    const container = section.querySelector('.container');
    if (container) {
        container.style.position = 'relative';
        container.style.zIndex = '1';
    }
    
    section.insertBefore(bgGlow, section.firstChild);

    gsap.fromTo(bgGlow, 
        { x: '-5%' },
        { x: '5%', duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' }
    );

    // Responsive settings
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const cardY = isMobile ? 25 : 45;
    const cardDur = isMobile ? 0.5 : 0.65;
    const floatY = isMobile ? -3 : (isTablet ? -4 : -5);
    
    // Create timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
        }
    });

    if (heading && subtitle) {
        tl.fromTo(heading, 
            { opacity: 0, y: 35 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(subtitle,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            "<0.15"
        );
    }

    tl.fromTo(cards,
        { opacity: 0, y: cardY, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: cardDur, stagger: 0.10, ease: 'power3.out' },
        "<0.2"
    );

    cards.forEach((card, index) => {
        const icon = card.querySelector('.category-icon-box i');
        if (icon) {
            gsap.to(icon, {
                y: floatY,
                duration: 2 + (index % 3) * 0.2, // slightly different duration/delay
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.15
            });
        }

        if (window.matchMedia('(hover: hover)').matches) {
            const arrow = card.querySelector('.category-card-arrow i');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -8, scale: 1.015, duration: 0.3, ease: 'power2.out', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' });
                
                if (icon) {
                    gsap.to(icon, { scale: 1.12, rotation: 4, duration: 0.3, ease: 'power2.out' });
                }
                
                if (arrow) {
                    gsap.to(arrow, { x: 7, duration: 0.3, ease: 'power2.out' });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' });
                
                if (icon) {
                    gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
                }
                
                if (arrow) {
                    gsap.to(arrow, { x: 0, duration: 0.4, ease: 'power2.out' });
                }
            });
        }
    });
}



function initStoryAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const mv = (val) => isMobile ? val * 0.4 : (isTablet ? val * 0.7 : val);

    // 1. GLOBAL SCROLL REVEAL - only for sections without specific split/trust animations
    const sections = document.querySelectorAll('section:not(.hero-section):not(.trust-strip-section)');
    sections.forEach(sec => {
        // Skip if this section has specific story animations
        if (sec.querySelector('.split-grid') || sec.classList.contains('split-section') || sec.querySelector('.trust-grid') || sec.querySelector('.categories-grid') || sec.querySelector('.products-grid')) {
            return;
        }
        const container = sec.querySelector('.container');
        if (container) {
            gsap.fromTo(container, 
                { opacity: 0, y: isMobile ? 25 : 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sec,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }
    });

    // 2. LICENSED HEALTHCARE SECTION
    const sec1 = document.querySelectorAll('.split-section')[0];
    if (sec1) {
        const img = sec1.querySelector('.split-image');
        const content = sec1.querySelector('.split-content');
        const features = sec1.querySelectorAll('.feature-card');
        
        const tl1 = gsap.timeline({ scrollTrigger: { trigger: sec1, start: 'top 75%', once: true } });

        if (img) tl1.fromTo(img, { opacity: 0, x: mv(-80), scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' });
        if (content) tl1.fromTo(content, { opacity: 0, x: mv(70) }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, "<0.15");
        if (features && features.length > 0) tl1.fromTo(features, { opacity: 0, y: mv(25), scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, "-=0.4");

        if (!isMobile && window.matchMedia('(hover: hover)').matches) {
            features.forEach(card => {
                card.addEventListener('mouseenter', () => gsap.to(card, { y: -4, scale: 1.02, duration: 0.3, boxShadow: '0 8px 24px rgba(14, 165, 233, 0.1)', ease: 'power2.out' }));
                card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', ease: 'power2.out' }));
            });
        }
    }

    // 3. BETTER HEALTH STARTS WITH BETTER CHOICES
    const healthTipsList = document.querySelector('.health-tips-list');
    if (healthTipsList) {
        const sec2 = healthTipsList.closest('section');
        const img = sec2.querySelector('.split-image');
        const content = sec2.querySelector('.split-content');
        const bullets = sec2.querySelectorAll('.health-tip-item');
        const btn = sec2.querySelector('.btn-primary');

        const tl2 = gsap.timeline({ scrollTrigger: { trigger: sec2, start: 'top 75%', once: true } });
        
        if (content) tl2.fromTo(content, { opacity: 0, x: mv(-70) }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' });
        if (img) tl2.fromTo(img, { opacity: 0, x: mv(80), scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, "<");
        if (bullets && bullets.length > 0) tl2.fromTo(bullets, { opacity: 0, x: mv(-15) }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, "-=0.3");
        if (btn) tl2.fromTo(btn, { opacity: 0, y: mv(15), scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, "-=0.1");

        if (!isMobile && btn && window.matchMedia('(hover: hover)').matches) {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { y: -3, duration: 0.2, boxShadow: '0 8px 15px rgba(14, 165, 233, 0.3)' });
                const icon = btn.querySelector('i');
                if (icon) gsap.to(icon, { x: 5, duration: 0.2 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { y: 0, duration: 0.3, boxShadow: 'none' });
                const icon = btn.querySelector('i');
                if (icon) gsap.to(icon, { x: 0, duration: 0.3 });
            });
        }
    }

    // 4. SPEAK WITH A LICENSED PHARMACIST SECTION
    const benefitsList = document.querySelector('.benefits-list');
    if (benefitsList) {
        const sec3 = benefitsList.closest('section');
        const img = sec3.querySelector('.split-image');
        const content = sec3.querySelector('.split-content');
        const bullets = sec3.querySelectorAll('li');
        const btn = sec3.querySelector('.btn-primary');

        const tl3 = gsap.timeline({ scrollTrigger: { trigger: sec3, start: 'top 75%', once: true } });
        
        if (img) tl3.fromTo(img, { opacity: 0, x: mv(-80), scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' });
        if (content) tl3.fromTo(content, { opacity: 0, x: mv(80) }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, "<0.15");
        if (bullets && bullets.length > 0) tl3.fromTo(bullets, { opacity: 0, x: mv(15) }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, "-=0.3");
        if (btn) tl3.fromTo(btn, { opacity: 0, y: mv(15) }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "-=0.1");

        if (!isMobile && btn && window.matchMedia('(hover: hover)').matches) {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.03, duration: 0.2 });
                const icon = btn.querySelector('i');
                if (icon) gsap.to(icon, { x: 5, duration: 0.2 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, duration: 0.3 });
                const icon = btn.querySelector('i');
                if (icon) gsap.to(icon, { x: 0, duration: 0.3 });
            });
        }
    }

    // 6. COLD-CHAIN STORAGE SECTION
    const coldChainHeader = Array.from(document.querySelectorAll('.section-title')).find(h => h.textContent.includes('Cold-Chain'));
    if (coldChainHeader) {
        const sec4 = coldChainHeader.closest('section');
        const header = sec4.querySelector('.section-header');
        const cards = sec4.querySelectorAll('.trust-card');

        const glowLine = document.createElement('div');
        glowLine.style.position = 'absolute';
        glowLine.style.top = '50%';
        glowLine.style.left = '-100%';
        glowLine.style.width = '100%';
        glowLine.style.height = '40px';
        glowLine.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(14,165,233,0.04) 50%, rgba(255,255,255,0) 100%)';
        glowLine.style.zIndex = '0';
        glowLine.style.pointerEvents = 'none';
        glowLine.style.filter = 'blur(10px)';
        
        if (getComputedStyle(sec4).position === 'static') sec4.style.position = 'relative';
        
        const grid = sec4.querySelector('.trust-grid');
        if (grid) {
            if (getComputedStyle(grid).position === 'static') grid.style.position = 'relative';
            grid.style.zIndex = '1';
        }
        
        sec4.insertBefore(glowLine, sec4.firstChild);
        
        gsap.to(glowLine, {
            left: '100%',
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        const tl4 = gsap.timeline({ scrollTrigger: { trigger: sec4, start: 'top 75%', once: true } });
        
        if (header) tl4.fromTo(header, { opacity: 0, y: mv(30), scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' });
        if (cards && cards.length > 0) tl4.fromTo(cards, { opacity: 0, y: mv(40) }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }, "-=0.3");
    }

    // 5. IMAGE MICRO-INTERACTION
    if (!isMobile && window.matchMedia('(hover: hover)').matches) {
        const splitImages = document.querySelectorAll('.split-image');
        splitImages.forEach(img => {
            img.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.03, duration: 0.5, ease: 'power2.out', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }));
            img.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out', boxShadow: 'none' }));
        });
    }

    // 7. UNIQUE SCROLL EFFECT (Healthcare Progress line)
    const progressLine = document.createElement('div');
    progressLine.style.position = 'fixed';
    progressLine.style.top = '0';
    progressLine.style.left = '0';
    progressLine.style.width = '3px';
    progressLine.style.height = '0%';
    progressLine.style.background = 'linear-gradient(to bottom, rgba(14,165,233,0.3), rgba(14,165,233,0.8))';
    progressLine.style.zIndex = '9999';
    progressLine.style.pointerEvents = 'none';
    document.body.appendChild(progressLine);

    gsap.to(progressLine, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });

    // 8. FLOATING HEALTHCARE DECORATION
    const splitGrids = document.querySelectorAll('.split-grid');
    splitGrids.forEach((grid, idx) => {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '14px';
        dot.style.height = '14px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(14,165,233,0.15)';
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '0';
        
        if (idx % 2 === 0) {
            dot.style.top = '15%';
            dot.style.left = '8%';
        } else {
            dot.style.bottom = '20%';
            dot.style.right = '8%';
        }
        
        const sec = grid.closest('section');
        if (sec) {
            if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
            sec.appendChild(dot);
            
            gsap.to(dot, {
                y: 10 + (Math.random() * 8),
                x: (Math.random() > 0.5 ? 1 : -1) * 6,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
        }
    });
}

// === Counter Animation for About Page ===
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const counters = document.querySelectorAll('.js-counter');
    if (counters.length === 0) return;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || 0, 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.5,
                    ease: 'power3.out',
                    onUpdate: () => {
                        counter.textContent = Math.floor(obj.val).toLocaleString() + suffix;
                    }
                });
            }
        });
    });
});
