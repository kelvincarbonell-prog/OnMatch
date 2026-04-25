// Año actual en el footer
document.getElementById('year').textContent = new Date().getFullYear();

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

// Efecto de escritura (typing)
const typingEl = document.querySelector('.typing-text');
const phrases = [
    'Ingeniero Informático',
    'Desarrollador de Software',
    'Apasionado por la tecnología'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex--);
    } else {
        typingEl.textContent = current.substring(0, charIndex++);
    }

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === current.length + 1) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === -1) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        delay = 300;
    }

    setTimeout(type, delay);
}
type();

// Botón "volver arriba"
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Resaltar enlace activo en navegación según scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// Reveal al hacer scroll + animación de barras de habilidades
const revealEls = document.querySelectorAll(
    '.section-title, .about-content, .skill-card, .project-card, .contact-form, .contact-intro'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.classList.contains('skill-card')) {
                const fill = entry.target.querySelector('.skill-fill');
                if (fill) fill.style.width = fill.dataset.level + '%';
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Validación del formulario de contacto
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function showError(field, message) {
    const group = field.parentElement;
    group.classList.add('invalid');
    group.querySelector('.error-msg').textContent = message;
}

function clearError(field) {
    const group = field.parentElement;
    group.classList.remove('invalid');
    group.querySelector('.error-msg').textContent = '';
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nombre = form.nombre;
    const email = form.email;
    const mensaje = form.mensaje;

    [nombre, email, mensaje].forEach(clearError);

    if (nombre.value.trim().length < 2) {
        showError(nombre, 'Ingresa un nombre válido.');
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Ingresa un email válido.');
        valid = false;
    }

    if (mensaje.value.trim().length < 10) {
        showError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
        valid = false;
    }

    if (valid) {
        formStatus.textContent = '¡Mensaje enviado! Te responderé pronto.';
        formStatus.classList.add('success');
        form.reset();
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.classList.remove('success');
        }, 4000);
    }
});

// Limpiar errores al escribir
form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
});
