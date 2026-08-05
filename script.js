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

        if (introAdvance) {
            introAdvance.addEventListener('click', (e) => {
                e.stopPropagation();
                advanceIntro();
            });
        }

        if (btnBegin) {
            btnBegin.addEventListener('click', (e) => {
                e.stopPropagation();
                intro.classList.add('is-closing');
                document.body.classList.remove('intro-active');
                if (dotNav) dotNav.classList.add('is-visible');
                setTimeout(() => { intro.style.display = 'none'; }, 900);
            });
        }
    };

    /* ---------------------------------------------------------------
       2. SCROLL NAVIGATION & REVEAL
    --------------------------------------------------------------- */
    const initObservers = () => {
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
        
        document.querySelectorAll('.js-open-board').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const src = trigger.getAttribute('data-src');
                if (src && boardImage) {
                    boardImage.src = src;
                    if (boardModal) boardModal.classList.add('is-active');
                    document.body.classList.add('modal-active');
                }
            });
        });

        document.querySelectorAll('.js-open-book').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                if (bookModal) bookModal.classList.add('is-active');
                document.body.classList.add('modal-active');
                initTurnJs();
            });
        });

        const closeModals = () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('is-active');
            });
            document.body.classList.remove('modal-active');
            document.querySelectorAll('video').forEach(video => video.pause());
        };

        document.querySelectorAll('.js-close-modal').forEach(btn => {
            btn.addEventListener('click', closeModals);
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-content')) {
                    closeModals();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModals();
        });
    };

    /* ---------------------------------------------------------------
       4. FLIPBOOK INITIALIZATION
    --------------------------------------------------------------- */
    const initTurnJs = () => {
        if (typeof $ === 'undefined') {
            console.error("jQuery is missing, Turn.js cannot run.");
            return;
        }
        
        const flipbook = $("#flipbook");
        if (!flipbook.length) return;
        
        if (flipbook.data("turn")) return;

        setTimeout(() => {
            flipbook.turn({
                width: 1200, 
                height: 650,
                autoCenter: true,
                gradients: true,
                elevation: 60,
                display: 'single' 
            });

            // BRUTE FORCE: Force single display again immediately after load
            flipbook.turn("display", "single");

            // 1. Better Click Navigation
            flipbook.off('click').on('click', function(e) {
                const offset = $(this).offset();
                const clickX = e.pageX - offset.left;
                
                if (clickX < $(this).width() / 2) {
                    $(this).turn("previous");
                } else {
                    $(this).turn("next");
                }
            });

            // 2. Keyboard Navigation Fallback
            $(document).off('keydown.flipbook').on('keydown.flipbook', function(e) {
                if (document.getElementById('bookModal').classList.contains('is-active')) {
                    if (e.keyCode === 37) {
                        flipbook.turn('previous');
                    } else if (e.keyCode === 39) {
                        flipbook.turn('next');
                    }
                }
            });

            // 3. UI Button Navigation
            const prevBtn = document.getElementById('prevPageBtn');
            const nextBtn = document.getElementById('nextPageBtn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    flipbook.turn('previous');
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    flipbook.turn('next');
                });
            }

        }, 600); 
    };

   // Execute Modules
    initIntro();
    initObservers();
    initModals();
});
