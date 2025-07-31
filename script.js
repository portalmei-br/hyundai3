// Professional Hyundai Auto Parts Website JavaScript
// Enhanced functionality for credibility and user experience

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚗 Autopeças Hyundai Professional - Sistema carregado');
    
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeAnimations();
    initializePerformanceOptimizations();
    
    // Professional loading indicator
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('⚡ Sistema totalmente carregado');
    }, 500);
});

// ===== NAVIGATION SYSTEM =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .credential-card,
        .product-card,
        .guarantee-item,
        .model-card,
        .testimonial-card,
        .contact-item
    `);
    
    animateElements.forEach(el => observer.observe(el));
}

// ===== FORM HANDLING =====
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    
    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                submitToWhatsApp(data);
            }
        });
    }
    
    // Real-time validation
    const inputs = contactForm?.querySelectorAll('input, textarea');
    inputs?.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(data) {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    // Remove previous error messages
    form.querySelectorAll('.error-message').forEach(msg => msg.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'model', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!data[fieldName] || data[fieldName].trim() === '') {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        }
    });
    
    // Validate phone format
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (data.phone && !phoneRegex.test(data.phone)) {
        const phoneField = form.querySelector('[name="phone"]');
        showFieldError(phoneField, 'Formato inválido. Use: (11) 99999-9999');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove previous error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate based on field type
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Formato inválido');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        font-weight: 600;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function submitToWhatsApp(data) {
    const submitBtn = document.querySelector('.btn-form-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Prepare WhatsApp message
    const message = `🚗 *SOLICITAÇÃO DE ORÇAMENTO TÉCNICO*

👤 *Cliente:* ${data.name}
📞 *Telefone:* ${data.phone}
🚙 *Veículo:* ${data.model}
${data.chassis ? `🔢 *Chassi:* ${data.chassis}` : ''}

📝 *Descrição da Peça:*
${data.message}

---
Solicitação enviada via site oficial
⏰ ${new Date().toLocaleString('pt-BR')}`;
    
    const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    
    // Simulate processing time for professional feel
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showSuccessMessage();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #22C55E, #16A34A);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            margin: 1rem 0;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Solicitação enviada com sucesso! Você será redirecionado para o WhatsApp.
        </div>
    `;
    
    const form = document.getElementById('contactForm');
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Counter animation for credentials
    const counters = document.querySelectorAll('.credential-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.product-card, .credential-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[\d\s]/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 40);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registrado');
                })
                .catch(error => {
                    console.log('❌ Falha no Service Worker:', error);
                });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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

// WhatsApp link tracking
function trackWhatsAppClick(source) {
    console.log(`📱 WhatsApp clicado: ${source}`);
    
    // Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': source
        });
    }
}

// Add click tracking to all WhatsApp buttons
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const source = this.closest('section')?.id || `button-${index + 1}`;
            trackWhatsAppClick(source);
        });
    });
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger?.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn-cta-primary')) {
        e.target.click();
    }
});

// Focus management
document.addEventListener('DOMContentLoaded', function() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #002C5F;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        font-weight: 600;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('❌ Erro capturado:', e.error);
    
    // Graceful degradation for critical features
    if (e.error?.message?.includes('IntersectionObserver')) {
        console.log('🔄 Fallback para animações sem IntersectionObserver');
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Performance metrics
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Página carregada em ${loadTime}ms`);
        
        // Log performance to console for debugging
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Métricas de Performance:', {
                'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                'TCP Connection': perfData.connectEnd - perfData.connectStart,
                'Request': perfData.responseStart - perfData.requestStart,
                'Response': perfData.responseEnd - perfData.responseStart,
                'DOM Processing': perfData.domContentLoadedEventEnd - perfData.responseEnd,
                'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
            });
        }, 1000);
    }
});

console.log('🚗 Autopeças Hyundai Professional - JavaScript carregado com sucesso!');

