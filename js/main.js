document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const htmlTag = document.documentElement;
    let currentLang = localStorage.getItem('language') || 'en';

    // --- Preloader ---
    window.addEventListener('load', () => {
        // Make sure all content is loaded before hiding loader
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
                document.body.style.overflow = 'auto'; // Allow scroll after load
                
                // Make sure hero section is visible
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                    heroSection.style.opacity = '1';
                    heroSection.style.transform = 'translateY(0)';
                }
            }, 500);
        }, 1000); // Give more time for images to load
    });
    document.body.style.overflow = 'hidden'; // Prevent scroll during load

    // --- Particles.js for Global Background ---
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#64ffda" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": true, "anim": { "enable": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#8892b0", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } } }
            },
            "retina_detect": true
        });
    }

    // --- Typed Text Animation ---
    const typedTextSpan = document.getElementById("typed-text");
    let typedTextIndex = 0;
    let currentTypedText = "";
    let isDeleting = false;

    function type() {
        const textsToType = translations[currentLang].heroTypedText;
        if (!textsToType || textsToType.length === 0 || !typedTextSpan) return; // Guard clause

        const currentFullText = textsToType[typedTextIndex];

        if (isDeleting) {
            currentTypedText = currentFullText.substring(0, currentTypedText.length - 1);
        } else {
            currentTypedText = currentFullText.substring(0, currentTypedText.length + 1);
        }

        typedTextSpan.textContent = currentTypedText;
        let typeSpeed = isDeleting ? 60 : 120;

        if (!isDeleting && currentTypedText === currentFullText) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentTypedText === "") {
            isDeleting = false;
            typedTextIndex = (typedTextIndex + 1) % textsToType.length;
            typeSpeed = 300;
        }
        setTimeout(type, typeSpeed);
    }

    // --- Language Switcher ---
    const langButtons = document.querySelectorAll('.language-switcher button');
    function setLanguage(lang) {
        currentLang = lang;
        htmlTag.lang = lang;
        htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', lang);

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else if (el.classList.contains('translatable-list')) {
                    el.innerHTML = '';
                    const listItems = translations[lang][key];
                    if (Array.isArray(listItems)) {
                        listItems.forEach(itemText => {
                            const li = document.createElement('li');
                            li.textContent = itemText;
                            el.appendChild(li);
                        });
                    }
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        
        // Toggle special Arabic timeline style
        document.querySelectorAll('.timeline').forEach(timeline => {
            if (lang === 'ar') {
                timeline.classList.add('timeline-ar');
                timeline.style.display = 'none';
            } else {
                timeline.classList.remove('timeline-ar');
                timeline.style.display = '';
            }
        });
        document.querySelectorAll('.simple-list-ar').forEach(list => {
            if (lang === 'ar') {
                list.style.display = '';
            } else {
                list.style.display = 'none';
            }
        });
        
        typedTextIndex = 0;
        currentTypedText = "";
        isDeleting = false;
        if (typedTextSpan) type();
        
        setupProjectModals(); // Re-initialize modals for new language
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => setLanguage(button.dataset.lang));
    });

    // --- Navigation Burger Menu ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('nav-active') && burger) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(l => l.style.animation = '');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('project-card')) {
                    const parentGrid = entry.target.closest('.projects-grid');
                    if (parentGrid) {
                        const cardsInGrid = Array.from(parentGrid.querySelectorAll('.project-card.scroll-reveal:not(.visible)'));
                        const cardIndex = cardsInGrid.indexOf(entry.target);
                        if (cardIndex > -1) {
                           entry.target.style.transitionDelay = `${cardIndex * 0.15}s`;
                        }
                    }
                }
                entry.target.classList.add('visible');
                // revealObserver.unobserve(entry.target); // Optional: unobserve after first reveal
            } else {
                // Optional: remove 'visible' to re-trigger animation on scroll up.
                // Needs careful handling of transition delays if re-enabled.
                // entry.target.classList.remove('visible');
                // if (entry.target.classList.contains('project-card')) {
                //     entry.target.style.transitionDelay = '0s';
                // }
            }
        });
    }, { threshold: 0.1 });

    scrollRevealElements.forEach(el => revealObserver.observe(el));

    // --- Project Modal ---
    const modal = document.getElementById("projectModal");
    const modalProjectImage = document.getElementById("modalProjectImage");
    const modalProjectTitle = document.getElementById("modalProjectTitle");
    const modalProjectRole = document.getElementById("modalProjectRole");
    const modalProjectTech = document.getElementById("modalProjectTech");
    const modalProjectDescription = document.getElementById("modalProjectDescription");
    const closeBtn = modal ? modal.querySelector(".close-btn") : null;

    function openModal(projectId) {
        const details = projectDetails[currentLang][projectId];
        if (details && modal) {
            modalProjectImage.src = details.image;
            modalProjectImage.alt = details.title;
            modalProjectTitle.textContent = details.title;
            modalProjectRole.textContent = details.role;
            
            modalProjectTech.innerHTML = '';
            details.tech.forEach(techItem => {
                const span = document.createElement('span');
                span.textContent = techItem;
                modalProjectTech.appendChild(span);
            });
            
            modalProjectDescription.textContent = details.description;
            modal.style.display = "block";
            document.body.style.overflow = 'hidden';
        }
    }
    
    function setupProjectModals() {
        document.querySelectorAll(".project-card").forEach(card => {
            // Clone and replace to remove old listeners effectively
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener("click", () => {
                const projectId = newCard.dataset.projectId;
                openModal(projectId);
            });
        });
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if(modal) modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }
    window.onclick = (event) => {
        if (event.target == modal && modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }
    
    // --- Sticky Header on Scroll ---
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                header.style.top = `-${header.offsetHeight + 10}px`; // +10 to hide shadow
            } else {
                header.style.top = "0";
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const navLiAnchors = document.querySelectorAll('header nav ul li a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (header ? header.offsetHeight : 60) - 50) { // Adjusted offset
                currentSectionId = section.getAttribute('id');
            }
        });

        navLiAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === currentSectionId) {
                a.classList.add('active');
            }
        });
        // If no section is "current" (e.g. at the very top or bottom past last section), highlight home
        if (!currentSectionId && pageYOffset < sections[0].offsetTop - (header ? header.offsetHeight : 60) - 50) {
             const homeLink = document.querySelector('header nav ul li a[href="#hero"]');
             if(homeLink) homeLink.classList.add('active');
        }
    });

    // Initial load
    setLanguage(currentLang); // This also calls type() and setupProjectModals()
});