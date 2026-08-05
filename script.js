/* =================================================================
   script.js
   Modular interactions for the exhibition site.
================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------------
       1. INTRO SEQUENCE
    --------------------------------------------------------------- */
    const initIntro = () => {
        const intro = document.getElementById('intro');
        if (!intro) return;

        const introSteps = document.querySelectorAll('.intro-step');
        const introAdvance = document.getElementById('introAdvance');
        const btnBegin = document.getElementById('btnBegin');
        const dotNav = document.getElementById('dotNav');

        let step = 0;
        const lastStep = introSteps.length - 1;

        document.body.classList.add('intro-active');

        const renderStep = () => {
            introSteps.forEach(el => {
                el.classList.toggle('is-active', Number(el.dataset.step) === step);
            });
            intro.className = 'intro step-' + step;
        };
        
        renderStep();

        const advanceIntro = () => {
            if (step < lastStep) {
                step += 1;
                renderStep();
            }
        };

        intro.addEventListener('click', (e) => {
            if (e.target.closest('#btnBegin')) return;
            advanceIntro();
        });

        introAdvance.addEventListener('click', (e) => {
            e.stopPropagation();
            advanceIntro();
        });

        btnBegin.addEventListener('click', (e) => {
            e.stopPropagation();
            intro.classList.add('is-closing');
            document.body.classList.remove('intro-active');
            dotNav.classList.add('is-visible');
            setTimeout(() => { intro.style.display = 'none'; }, 900);
        });
    };

    /* ---------------------------------------------------------------
       2. SCROLL NAVIGATION & REVEAL
    --------------------------------------------------------------- */
    const initObservers = () => {
        // Dot Navigation Active State
        const dots = document.querySelectorAll('.dot');
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    dots.forEach(d => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
                }
            });
        }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

        document.querySelectorAll('.chapter, .hero').forEach(s => {
            if (s.id) navObserver.observe(s);
        });

        // Scroll Reveal Animation
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    };

    /* ---------------------------------------------------------------
       3. MODAL CONTROLLER (BOARD & BOOK)
    --------------------------------------------------------------- */
    const initModals = () => {
        const boardModal = document.getElementById('boardViewer');
        const boardImage = document.getElementById('boardViewerImage');
        const bookModal = document.getElementById('bookModal');
        
        // Open Board
        document.querySelectorAll('.js-open-board').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const src = trigger.getAttribute('data-src');
                if (src && boardImage) {
                    boardImage.src = src;
                    boardModal.classList.add('is-active');
                    document.body.classList.add('modal-active');
                }
            });
        });

        // Open Book
        document.querySelectorAll('.js-open-book').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                bookModal.classList.add('is-active');
                document.body.classList.add('modal-active');
                initTurnJs();
            });
        });

        // Universal Close Logic
        const closeModals = () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('is-active');
            });
            document.body.classList.remove('modal-active');
            
            // Pause any playing videos when closing modals
            document.querySelectorAll('video').forEach(video => video.pause());
        };

        // Close on Button Click
        document.querySelectorAll('.js-close-modal').forEach(btn => {
            btn.addEventListener('click', closeModals);
        });

        // Close on Background Click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-content')) {
                    closeModals();
                }
            });
        });

        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModals();
        });
    };

    /* ---------------------------------------------------------------
       4. FLIPBOOK INITIALIZATION
    --------------------------------------------------------------- */
    const initTurnJs = () => {
        const flipbook = $("#flipbook");
        
        // Prevent double initialization
        if (flipbook.data("turn")) return;

        // Dynamically inject pages to keep HTML clean
        const pages = [
            "5. DESIGN/studio ass 2 collection.jpeg",
            "5. DESIGN/studio ass 2 1.jpg",
            "5. DESIGN/studio ass 2 2.jpg",
            "5. DESIGN/studio ass 2 3.jpg",
            "5. DESIGN/studio ass 2 4.jpg",
            "5. DESIGN/studio ass 2 5.jpg",
            "5. DESIGN/studio ass 2 6.jpg",
            "5. DESIGN/studio ass 2 7.jpg",
            "5. DESIGN/studio ass 2 8.jpg",
            "5. DESIGN/studio ass 2 9.jpg",
            "5. DESIGN/studio ass 2 10.jpg",
            "5. DESIGN/studio ass 2 11.jpg",
            "5. DESIGN/studio ass 2 12.jpg",
            "5. DESIGN/studio ass 2 13.jpg",
            "5. DESIGN/studio ass 2 14.jpg",
            "5. DESIGN/studio ass 2 15.jpg",
            "5. DESIGN/studio ass 2 16.jpg",
            "5. DESIGN/studio ass 2 17.jpg",
            "5. DESIGN/studio ass 2 18.jpg",
            "5. DESIGN/studio ass 2 19.jpg"
        ];

        let html = '';
        pages.forEach(src => {
            html += `<div class="page"><img src="${src}" alt="Book Page"></div>`;
        });
        
        document.getElementById('flipbook').innerHTML = html;

        // Initialize Turn.js
        flipbook.turn({
            width: 1100,
            height: 720,
            autoCenter: true,
            gradients: true,
            elevation: 60
        });
    };

    // Execute Modules
    initIntro();
    initObservers();
    initModals();

});
