/**
 * Millennium CRM – Landing page
 * Partículas, tema escuro/claro, scroll suave, reveal, barra inferior, formulário.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'millennium-theme';

    function getTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function setTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        updateParticlesColors(theme);
    }

    function updateThemeIcon(theme) {
        var icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === 'light' ? 'fa fa-moon-o' : 'fa fa-sun-o';
        }
    }

    function updateParticlesColors() {
        initParticles();
    }

    function initThemeToggle() {
        var saved = getTheme();
        setTheme(saved);
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme') || 'dark';
                setTheme(current === 'dark' ? 'light' : 'dark');
            });
        }
    }

    function initParticles() {
        if (typeof particlesJS !== 'function') return;
        var el = document.getElementById('particles-js');
        if (!el) return;
        var theme = getTheme();
        var colors = theme === 'light' ? ['#00ffff', '#0a0a0f'] : ['#00ffff', '#ffffff'];
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: colors },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ffff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('.container a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function initRevealOnScroll() {
        var elements = document.querySelectorAll('.reveal-on-scroll');
        if (!elements.length) return;
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
        );
        elements.forEach(function (el) { observer.observe(el); });
    }

    function initBottomBar() {
        var bar = document.getElementById('landing-bottom-bar');
        var hero = document.querySelector('.hero');
        if (!bar || !hero) return;
        function onScroll() {
            var heroRect = hero.getBoundingClientRect();
            bar.classList.toggle('is-visible', heroRect.bottom < 0);
            bar.setAttribute('aria-hidden', heroRect.bottom < 0 ? 'false' : 'true');
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initHeaderScrollFade() {
        var header = document.getElementById('main-header');
        var headerInner = header && header.querySelector('.header-inner');
        var hero = document.querySelector('.hero');
        if (!header || !headerInner || !hero) return;

        var startFadeAt = 280;
        var fullyFadedAt = 80;

        function onScroll() {
            var heroRect = hero.getBoundingClientRect();
            var top = heroRect.top;
            if (top > startFadeAt) {
                headerInner.style.opacity = '1';
                headerInner.style.filter = 'none';
                header.classList.remove('header-faded');
                return;
            }
            if (top < fullyFadedAt) {
                headerInner.style.opacity = '0';
                headerInner.style.filter = 'drop-shadow(0 0 30px rgba(0,255,255,0.6))';
                header.classList.add('header-faded');
                return;
            }
            var progress = 1 - (top - fullyFadedAt) / (startFadeAt - fullyFadedAt);
            var opacity = 1 - progress;
            var glow = progress * 0.6;
            headerInner.style.opacity = String(opacity);
            headerInner.style.filter = 'drop-shadow(0 0 ' + (15 + glow * 25) + 'px rgba(0,255,255,' + glow + '))';
            header.classList.remove('header-faded');
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        var form = e.target;
        var data = {
            nome: form.nome && form.nome.value,
            email: form.email && form.email.value,
            telefone: form.telefone && form.telefone.value,
            empresa: form.empresa && form.empresa.value,
            mensagem: form.mensagem && form.mensagem.value
        };
        console.log('Contato Millennium CRM:', data);
        form.reset();
        alert('Mensagem recebida! Entraremos em contato em breve.');
    }

    function initForm() {
        var form = document.getElementById('form-contato');
        if (form) form.addEventListener('submit', handleFormSubmit);
    }

    function init() {
        initThemeToggle();
        initParticles();
        initSmoothScroll();
        initRevealOnScroll();
        initHeaderScrollFade();
        initBottomBar();
        initForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.millenniuum = { handleFormSubmit: handleFormSubmit };
})();
