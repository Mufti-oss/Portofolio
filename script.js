/**
 * Portfolio Script — Mufti Rayhan Nurfadillah
 * Vanilla JavaScript (No Frameworks)
 * 
 * Features:
 * - AOS scroll animations
 * - Typed.js typing effect
 * - Sticky navbar with glassmorphism
 * - Mobile hamburger navigation
 * - Counter animation on stats
 * - Active nav link highlighting
 * - Contact form handling
 * - Smooth scroll behavior
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       AOS ANIMATION SYSTEM
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: true,
            offset: 80,
            delay: 50,
            easing: 'ease-out-cubic'
        });
    }

    /* ==========================================================================
       TYPED TEXT ANIMATION (Typed.js)
       ========================================================================== */
    const typedElement = document.getElementById('typed');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: [
                'Information Technology Student',
                'Front-End Developer',
                'Back-End Developer',
                'UI/UX Designer',
                'Database Enthusiast'
            ],
            typeSpeed: 55,
            backSpeed: 40,
            backDelay: 2200,
            startDelay: 600,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    /* ==========================================================================
       STICKY NAVBAR WITH BLUR EFFECT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    const handleNavbarScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    });

    // Initial check on page load
    handleNavbarScroll();

    /* ==========================================================================
       MOBILE NAVIGATION OVERLAY
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileCTA = document.querySelector('.btn-mobile-hire');

    const openMobileMenu = () => {
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggleMobileMenu = () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    if (mobileCTA) {
        mobileCTA.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       STATS COUNTER ANIMATION
       Uses IntersectionObserver for performance
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2200; // ms
        const startTime = performance.now();

        const count = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for a premium smooth feel
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(eased * target);

            // Format based on target value
            if (target === 100) {
                el.textContent = `${currentValue}%`;
            } else if (target === 2) {
                el.textContent = `${currentValue} Years`;
            } else {
                el.textContent = `${currentValue}+`;
            }

            if (progress < 1) {
                requestAnimationFrame(count);
            } else {
                // Ensure final value is exact
                if (target === 100) {
                    el.textContent = '100%';
                } else if (target === 2) {
                    el.textContent = '2 Years';
                } else {
                    el.textContent = `${target}+`;
                }
            }
        };

        requestAnimationFrame(count);
    };

    // Observe the stats grid to trigger counter animation
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15
        });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       ACTIVE NAV LINK HIGHLIGHT ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let navHighlightTicking = false;

    const setActiveNavLink = (sectionId) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    };

    const highlightActiveLink = () => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Check if at the bottom of page
        if (scrollY + windowHeight >= docHeight - 50) {
            setActiveNavLink('contact');
            navHighlightTicking = false;
            return;
        }

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 140;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                setActiveNavLink(sectionId);
            }
        });

        navHighlightTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!navHighlightTicking) {
            requestAnimationFrame(highlightActiveLink);
            navHighlightTicking = true;
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href').replace('#', '');
            setActiveNavLink(targetId);
        });
    });

    // Initial highlight
    highlightActiveLink();

    /* ==========================================================================
       CONTACT FORM HANDLING (Mock Submission)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = document.getElementById('submitBtn');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Validation
            if (!name || !email || !message) {
                showFeedback('Harap lengkapi semua kolom input.', 'error');
                return;
            }

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback('Harap masukkan alamat email yang valid.', 'error');
                return;
            }

            // Simulate submission
            submitBtn.disabled = true;
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `Sending... <span class="btn-submit-icon"><i class="fa-solid fa-spinner fa-spin"></i></span>`;

            setTimeout(() => {
                showFeedback(`Terima kasih, ${name}! Pesan Anda telah berhasil dikirim. 🎉`, 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;

                // Auto-hide feedback after 6 seconds
                setTimeout(() => {
                    if (formFeedback) {
                        formFeedback.classList.add('hidden');
                    }
                }, 6000);
            }, 1800);
        });
    }

    /**
     * Display form feedback message
     * @param {string} msg - Feedback message text
     * @param {string} type - 'success' or 'error'
     */
    const showFeedback = (msg, type) => {
        if (!formFeedback) return;
        formFeedback.textContent = msg;
        formFeedback.className = 'form-feedback'; // Reset
        formFeedback.classList.add(type);
        formFeedback.classList.remove('hidden');
    };

    /* ==========================================================================
       DOWNLOAD CV HANDLER
       ========================================================================== */
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with an actual CV file link for production
            alert('Menyiapkan file CV Mufti Rayhan Nurfadillah untuk diunduh...');
        });
    }

    /* ==========================================================================
       SMOOTH SCROLL FOR ALL ANCHOR LINKS
       Polyfill-like approach for older browsers
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offsetTop = targetEl.offsetTop - 90;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       PARALLAX-LIKE SUBTLE EFFECTS ON HERO
       ========================================================================== */
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < 900) {
                const translateY = scrollY * 0.06;
                const opacity = 1 - (scrollY * 0.0008);
                heroContainer.style.transform = `translateY(${translateY}px)`;
                heroContainer.style.opacity = Math.max(opacity, 0.4);
            }
        });
    }
});
