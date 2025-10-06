/**
 * Plataforma de Reconexión Humana - JavaScript
 * Funcionalidades interactivas para mejorar la experiencia del usuario
 */

class ReconexionHumanaApp {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initSmoothScrolling();
        this.initMobileMenu();
        this.initNavbarEffects();
        this.initTypingEffect();
        this.initCounterAnimations();
        this.initFormValidation();
        this.bindEvents();
    }

    /**
     * Inicializa las animaciones de scroll
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos para animaciones
        const animatedElements = document.querySelectorAll(`
            .problem-card,
            .solution-card,
            .process-step,
            .metric-card,
            .benefit-card,
            .privacy-card,
            .stat-card
        `);

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            this.scrollObserver.observe(el);
        });
    }

    /**
     * Inicializa el scroll suave para enlaces internos
     */
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Inicializa el menú móvil
     */
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('mobile-active');
                document.body.classList.toggle('menu-open');
            });

            // Cerrar menú al hacer clic en un enlace
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('mobile-active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    /**
     * Efectos de la barra de navegación
     */
    initNavbarEffects() {
        const nav = document.querySelector('.nav');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Agregar clase cuando se hace scroll
            if (scrollTop > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Ocultar/mostrar nav en mobile al hacer scroll
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    /**
     * Efecto de escritura para el título del hero
     */
    initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        const highlight = heroTitle.querySelector('.highlight');
        
        if (highlight) {
            const highlightText = highlight.textContent;
            const beforeHighlight = text.substring(0, text.indexOf(highlightText));
            const afterHighlight = text.substring(text.indexOf(highlightText) + highlightText.length);
            
            heroTitle.innerHTML = '';
            
            setTimeout(() => {
                this.typeText(heroTitle, beforeHighlight, 50, () => {
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    heroTitle.appendChild(span);
                    
                    this.typeText(span, highlightText, 50, () => {
                        this.typeText(heroTitle, afterHighlight, 50);
                    });
                });
            }, 500);
        }
    }

    /**
     * Función auxiliar para el efecto de escritura
     */
    typeText(element, text, speed, callback) {
        let i = 0;
        const timer = setInterval(() => {
            if (element.tagName === 'SPAN') {
                element.textContent += text[i];
            } else {
                element.innerHTML += text[i];
            }
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
    }

    /**
     * Animaciones de contadores para las métricas
     */
    initCounterAnimations() {
        const counters = document.querySelectorAll('.metric-value, .stat-number');
        
        const countUp = (element, target) => {
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 20);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent.trim();
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    
                    if (number && !element.classList.contains('counted')) {
                        element.classList.add('counted');
                        element.textContent = '0';
                        
                        setTimeout(() => {
                            if (text.includes('%')) {
                                countUp(element, number);
                                setTimeout(() => {
                                    element.textContent = number + '%';
                                }, 2000);
                            } else {
                                countUp(element, number);
                            }
                        }, 200);
                    }
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Validación básica de formularios
     */
    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        this.showError(input, 'Este campo es obligatorio');
                    } else {
                        input.classList.remove('error');
                        this.hideError(input);
                    }
                    
                    // Validación específica para email
                    if (input.type === 'email' && input.value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            this.showError(input, 'Por favor, ingresa un email válido');
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Mostrar mensaje de error
     */
    showError(input, message) {
        let errorElement = input.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Ocultar mensaje de error
     */
    hideError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Bindear eventos adicionales
     */
    bindEvents() {
        // Lazy loading para imágenes (si se agregan)
        this.initLazyLoading();
        
        // Efecto parallax suave en hero
        this.initParallaxEffect();
        
        // Manejo de resize de ventana
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Manejo de scroll para efectos adicionales
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }

    /**
     * Lazy loading para imágenes
     */
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Efecto parallax suave
     */
    initParallaxEffect() {
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                
                if (hero && scrolled < hero.offsetHeight) {
                    hero.style.transform = `translateY(${rate}px)`;
                }
            }
        });
    }

    /**
     * Manejo de resize de ventana
     */
    handleResize() {
        const nav = document.querySelector('.nav');
        
        // Resetear estilos del nav en desktop
        if (window.innerWidth > 768) {
            nav.style.transform = 'translateY(0)';
        }
    }

    /**
     * Manejo de scroll adicional
     */
    handleScroll() {
        // Actualizar active link en navegación
        this.updateActiveNavLink();
    }

    /**
     * Actualizar enlace activo en navegación
     */
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top + window.scrollY;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

/**
 * Utilidades adicionales
 */
class Utils {
    /**
     * Detectar si el usuario prefiere movimiento reducido
     */
    static prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Añadir clase con delay
     */
    static addClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    }

    /**
     * Crear elemento con atributos
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Generar ID único
     */
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Accessibility Manager
 */
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        const focusableElements = document.querySelectorAll(`
            a[href],
            button,
            input,
            textarea,
            select,
            details,
            [tabindex]:not([tabindex="-1"])
        `);

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }

    setupAriaLabels() {
        // Añadir aria-labels automáticamente donde sea necesario
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botón de acción');
            }
        });

        const links = document.querySelectorAll('a:not([aria-label])');
        links.forEach(link => {
            if (!link.textContent.trim()) {
                link.setAttribute('aria-label', 'Enlace');
            }
        });
    }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('performance' in window) {
            this.monitorPageLoad();
            this.monitorScrollPerformance();
        }
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }

    monitorScrollPerformance() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                const start = performance.now();
                
                scrollTimeout = setTimeout(() => {
                    const end = performance.now();
                    if (end - start > 16) {
                        console.warn('Scroll performance issue detected:', end - start, 'ms');
                    }
                    scrollTimeout = null;
                }, 100);
            }
        });
    }
}

/**
 * Inicializar aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario prefiere movimiento reducido
    if (!Utils.prefersReducedMotion()) {
        new ReconexionHumanaApp();
    } else {
        // Versión simplificada sin animaciones
        document.body.classList.add('reduced-motion');
        new ReconexionHumanaApp();
    }
    
    // Inicializar managers adicionales
    new AccessibilityManager();
    
    // Solo en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
});

/**
 * Service Worker para PWA (opcional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/**
 * Exportar clases para uso externo si es necesario
 */
window.ReconexionHumana = {
    App: ReconexionHumanaApp,
    Utils: Utils,
    AccessibilityManager: AccessibilityManager,
    PerformanceMonitor: PerformanceMonitor
};
