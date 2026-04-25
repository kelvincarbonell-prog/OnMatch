// Año actual en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Header con sombra al hacer scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
});

// Menú móvil
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// Botón "volver arriba"
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Reveal con IntersectionObserver
const revealEls = document.querySelectorAll(
    '.section-title, .section-subtitle, .step, .for-card, .story-card, .ai-content, .ai-visual, .contact-form'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Contador animado en las estadísticas del hero
const stats = document.querySelectorAll('.hero-stats strong');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const match = text.match(/^(\d+)(.*)$/);
            if (match) {
                const target = parseInt(match[1], 10);
                const suffix = match[2];
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 40));
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    el.textContent = current + suffix;
                }, 30);
            }
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

stats.forEach(s => statsObserver.observe(s));

// Validación del formulario de contacto
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function showError(field, message) {
    const group = field.closest('.form-group');
    group.classList.add('invalid');
    group.querySelector('.error-msg').textContent = message;
}

function clearError(field) {
    const group = field.closest('.form-group');
    group.classList.remove('invalid');
    group.querySelector('.error-msg').textContent = '';
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nombre = form.nombre;
    const email = form.email;
    const perfil = form.perfil;
    const mensaje = form.mensaje;

    [nombre, email, perfil, mensaje].forEach(clearError);

    if (nombre.value.trim().length < 2) {
        showError(nombre, 'Cuéntanos cómo te llamas.');
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Necesitamos un email válido.');
        valid = false;
    }

    if (!perfil.value) {
        showError(perfil, 'Selecciona una opción.');
        valid = false;
    }

    if (mensaje.value.trim().length < 10) {
        showError(mensaje, 'Cuéntanos un poquito más (mín. 10 caracteres).');
        valid = false;
    }

    if (valid) {
        formStatus.textContent = '¡Gracias! Te respondemos en menos de 24h.';
        formStatus.classList.add('success');
        form.reset();
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.classList.remove('success');
        }, 5000);
    }
});

form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
});
