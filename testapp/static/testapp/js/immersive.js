// ═══════════════════════════════════════════════════════════════
// Aura Café — Immersive Interaction Engine
// Cursor tracking, 3D card tilt, magnetic buttons, scroll 
// effects, character reveals, and ambient interactions.
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ── Cursor Glow Orb ──────────────────────────────────────
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let rafId = null;

    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            // Smooth lerp
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;

            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';

            rafId = requestAnimationFrame(animateGlow);
        }
        animateGlow();

        // Enhance glow in hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cursorGlow.classList.add('hero-active');
                    } else {
                        cursorGlow.classList.remove('hero-active');
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(hero);
        }
    }

    // ── Scroll Progress Bar ──────────────────────────────────
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = percent + '%';
        }, { passive: true });
    }

    // ── Navbar Scroll State ──────────────────────────────────
    const navbar = document.getElementById('main-navbar');
    
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ── 3D Card Tilt Effect ──────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.menu-card');

        cards.forEach(card => {
            // Add tilt glow overlay
            if (!card.querySelector('.card-tilt-glow')) {
                const glowEl = document.createElement('div');
                glowEl.className = 'card-tilt-glow';
                card.appendChild(glowEl);
            }

            card.addEventListener('mouseenter', () => {
                card.classList.add('tilt-active');
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Tilt angles (subtle)
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Update glow position
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                card.style.setProperty('--mouse-x', percentX + '%');
                card.style.setProperty('--mouse-y', percentY + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('tilt-active');
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease-out';
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });
        });

        // ── Magnetic Button Effect ───────────────────────────
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Subtle magnetic pull
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        // ── Character-by-Character Reveal ────────────────────
        const charRevealEls = document.querySelectorAll('.char-reveal');

        charRevealEls.forEach(el => {
            const text = el.textContent.trim();
            el.innerHTML = '';
            el.style.opacity = '1';

            // Split into characters
            [...text].forEach((char, i) => {
                if (char === ' ') {
                    const space = document.createElement('span');
                    space.className = 'char-space';
                    el.appendChild(space);
                } else {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char;
                    span.style.animationDelay = (0.4 + i * 0.04) + 's';
                    el.appendChild(span);
                }
            });
        });

        // ── Scroll Reveal Sections ───────────────────────────
        const revealEls = document.querySelectorAll('.scroll-reveal');

        if (revealEls.length > 0 && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealEls.forEach(el => revealObserver.observe(el));
        }

        // ── Hero Parallax on Mouse Move ──────────────────────
        const heroSection = document.querySelector('.hero');
        const heroParticles = document.querySelector('.hero-particles');

        if (heroSection && heroParticles) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                // Parallax shift for particles
                heroParticles.style.transform = `translate(${x * 20}px, ${y * 15}px)`;
            });

            heroSection.addEventListener('mouseleave', () => {
                heroParticles.style.transform = '';
                heroParticles.style.transition = 'transform 0.5s ease-out';
                setTimeout(() => {
                    heroParticles.style.transition = '';
                }, 500);
            });
        }

        // ── Smooth Section Scroll for CTA ────────────────────
        const ctaBtn = document.getElementById('hero-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('menu-section');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });

    // ── Cleanup on page unload ───────────────────────────────
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });
})();
