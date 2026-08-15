// js/health-animations.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Initial load animation timeline
    const tlLoad = gsap.timeline();
    
    // Header & Logo fade in
    tlLoad.fromTo('.site-header', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    )
    // Navigation items stagger
    .fromTo('.desktop-nav .nav-link, .header-actions > *',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.2'
    )
    // Main hero content
    .fromTo('.hero-content > *',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
    )
    .fromTo('.split-image',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
    );

    // Select sections based on their titles
    const sections = Array.from(document.querySelectorAll('.section-padding'));
    
    sections.forEach((sec, index) => {
        const titleEl = sec.querySelector('.section-title, h2');
        if (!titleEl) return;
        const titleText = titleEl.innerText || titleEl.textContent;

        if (titleText.includes('Daily Wellness Tips')) {
            // Section 1: Daily Wellness Tips
            const headerObj = sec.querySelector('.section-header');
            if (headerObj) {
                gsap.fromTo(headerObj,
                    { y: 30, opacity: 0, filter: 'blur(8px)' },
                    { 
                        scrollTrigger: { trigger: sec, start: 'top 80%', once: true },
                        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out'
                    }
                );
            }

            const cards = sec.querySelectorAll('.health-guide-card');
            if (cards.length) {
                gsap.fromTo(cards,
                    { y: 40, opacity: 0, scale: 0.96 },
                    {
                        scrollTrigger: { trigger: sec, start: 'top 75%', once: true },
                        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)'
                    }
                );

                // Hover effects
                cards.forEach(card => {
                    const icon = card.querySelector('.health-card-icon');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -8, boxShadow: '0 16px 32px rgba(14, 165, 233, 0.12)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1.1, rotation: 5, duration: 0.3 });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.04)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3 });
                    });
                    
                    // Subtle floating icon
                    if (icon) {
                        gsap.to(icon, {
                            y: -4,
                            duration: 2.5,
                            repeat: -1,
                            yoyo: true,
                            ease: 'sine.inOut',
                            delay: Math.random() * 2
                        });
                    }
                });
            }

        } else if (titleText.includes('Medicine Safety')) {
            // Section 2: Medicine Safety
            const headerObj = sec.querySelector('.section-header');
            if (headerObj) {
                gsap.fromTo(headerObj.children,
                    { y: 20, opacity: 0 },
                    { 
                        scrollTrigger: { trigger: sec, start: 'top 75%', once: true },
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out'
                    }
                );
            }

            const cards = sec.querySelectorAll('.health-guide-card');
            if (cards.length) {
                gsap.fromTo(cards,
                    { x: -30, opacity: 0 },
                    {
                        scrollTrigger: { trigger: sec, start: 'top 70%', once: true },
                        x: 0, opacity: 1, duration: 0.5, stagger: 0.2, ease: 'power2.out'
                    }
                );

                cards.forEach(card => {
                    card.classList.add('has-icon-glow');
                    const icon = card.querySelector('.health-card-icon');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -5, boxShadow: '0 12px 24px rgba(14, 165, 233, 0.1)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1.15, duration: 0.3 });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.04)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1, duration: 0.3 });
                    });
                });
            }

        } else if (titleText.includes('Family Health')) {
            // Section 3: Family Health
            const headerObj = sec.querySelector('.section-header');
            if (headerObj) {
                gsap.fromTo(headerObj,
                    { y: 40, opacity: 0 },
                    { 
                        scrollTrigger: { trigger: sec, start: 'top 75%', once: true },
                        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
                    }
                );
            }

            const cards = sec.querySelectorAll('.health-guide-card');
            if (cards.length) {
                // Remove generic animation classes if they interfere
                cards.forEach(c => c.classList.remove('js-animate-card'));
                
                gsap.fromTo(cards,
                    { opacity: 0, y: 40, rotationX: 12, scale: 0.96 },
                    {
                        scrollTrigger: { trigger: sec, start: 'top 70%', once: true },
                        opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', transformPerspective: 800
                    }
                );

                cards.forEach(card => {
                    const icon = card.querySelector('.health-card-icon');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -6, boxShadow: '0 12px 24px rgba(14, 165, 233, 0.1)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1.12, duration: 0.3 });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.04)', duration: 0.3 });
                        if (icon) gsap.to(icon, { scale: 1, duration: 0.3 });
                    });
                });
            }

        } else if (titleText.includes('BMI')) {
            // Section 4: BMI Calculator
            const container = sec.querySelector('.split-grid');
            if (container) {
                gsap.fromTo(container,
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: { trigger: sec, start: 'top 80%', once: true },
                        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
                    }
                );
            }
            
            const badge = sec.querySelector('.badge-tag');
            if (badge) {
                gsap.fromTo(badge,
                    { scale: 0.8, opacity: 0 },
                    { scrollTrigger: { trigger: sec, start: 'top 80%', once: true }, scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.5)' }
                );
            }

            const formEls = sec.querySelectorAll('h2, p, form');
            if (formEls.length) {
                gsap.fromTo(formEls,
                    { x: -20, opacity: 0 },
                    { scrollTrigger: { trigger: sec, start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3 }
                );
            }

            const refCard = sec.querySelector('.split-grid > div:nth-child(2)');
            if (refCard) {
                gsap.fromTo(refCard,
                    { x: 30, opacity: 0 },
                    { scrollTrigger: { trigger: sec, start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.6, delay: 0.4 }
                );
            }
        }
    });

    // Background shapes
    const bgContainer = document.createElement('div');
    bgContainer.className = 'health-bg-shapes';
    bgContainer.innerHTML = `
        <div class="health-blob shape-1"></div>
        <div class="health-blob shape-2"></div>
        <div class="health-blob shape-3"></div>
    `;
    document.body.prepend(bgContainer);

    gsap.to('.shape-1', { x: '10vw', y: '5vh', rotation: 20, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.shape-2', { x: '-15vw', y: '-10vh', rotation: -15, duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.shape-3', { x: '5vw', y: '-15vh', duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Handle BMI Calculate Button for GSAP counter
    const calcBtn = document.getElementById('calculate-bmi-btn');
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const scoreVal = document.getElementById('bmi-score-val');
    
    if (calcBtn && heightInput && weightInput && scoreVal) {
        calcBtn.addEventListener('click', () => {
            const h = parseFloat(heightInput.value);
            const w = parseFloat(weightInput.value);
            if (h > 0 && w > 0) {
                const bmi = w / ((h / 100) ** 2);
                const targetVal = parseFloat(bmi.toFixed(1));
                
                let progressTrack = document.getElementById('bmi-progress-track');
                if (!progressTrack) {
                    progressTrack = document.createElement('div');
                    progressTrack.id = 'bmi-progress-track';
                    progressTrack.style.cssText = 'width: 100%; height: 6px; background: #eee; border-radius: 4px; margin-top: 15px; overflow: hidden;';
                    
                    const progressBar = document.createElement('div');
                    progressBar.id = 'bmi-progress-bar';
                    progressBar.style.cssText = 'height: 100%; width: 0%; background: var(--primary); transition: width 1s ease-out, background-color 1s ease-out;';
                    
                    progressTrack.appendChild(progressBar);
                    const resultBox = document.getElementById('bmi-result-box');
                    if (resultBox) resultBox.appendChild(progressTrack);
                }

                setTimeout(() => {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: targetVal,
                        duration: 1.5,
                        ease: 'power3.out',
                        onUpdate: () => {
                            scoreVal.textContent = obj.val.toFixed(1);
                        }
                    });

                    const bar = document.getElementById('bmi-progress-bar');
                    if (bar) {
                        let pct = (targetVal / 40) * 100;
                        if (pct > 100) pct = 100;
                        
                        let color = 'var(--primary)';
                        if (targetVal < 18.5) color = 'var(--warning)';
                        else if (targetVal <= 24.9) color = 'var(--success)';
                        else if (targetVal <= 29.9) color = 'var(--warning)';
                        else color = 'var(--danger)';

                        setTimeout(() => {
                            bar.style.width = pct + '%';
                            bar.style.backgroundColor = color;
                        }, 100);
                    }
                }, 50);
            }
        });
    }
});
