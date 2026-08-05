/* =================================================================
   script.js
   All interactions for the exhibition site. Organized by section —
   each block is independent, so you can lift/modify one without
   touching the others.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. INTRO CLICK-THROUGH SEQUENCE
     Clicking anywhere on the intro (or the advance dot) moves to the
     next step. Background layers get a "step-N" class on the intro
     wrapper so CSS can cross-fade/zoom them at the right moments.
     --------------------------------------------------------------- */
  const intro = document.getElementById('intro');
  const introSteps = document.querySelectorAll('.intro-step');
  const introAdvance = document.getElementById('introAdvance');
  const btnBegin = document.getElementById('btnBegin');
  const dotNav = document.getElementById('dotNav');

  let step = 0;
  const lastStep = introSteps.length - 1;

  document.body.classList.add('intro-active');

  function renderStep() {
    introSteps.forEach(el => {
      el.classList.toggle('is-active', Number(el.dataset.step) === step);
    });
    intro.className = 'intro step-' + step;
  }
  renderStep();

  function advanceIntro() {
    if (step < lastStep) {
      step += 1;
      renderStep();
    }
  }

  intro.addEventListener('click', (e) => {
    // Don't advance if the click was the "Begin Walking" button itself —
    // that has its own handler below.
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
    window.setTimeout(() => { intro.style.display = 'none'; }, 900);
  });

  /* ---------------------------------------------------------------
     2. DOT NAVIGATION — active state via IntersectionObserver
     --------------------------------------------------------------- */
  const dots = document.querySelectorAll('.dot');
  const sections = document.querySelectorAll('main .chapter, main .essay-title');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(d => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  document.querySelectorAll('.chapter[id]').forEach(s => navObserver.observe(s));

  /* ---------------------------------------------------------------
     3. REVEAL ON SCROLL
     --------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     4. CHAPTER 2 — MAP LIGHTBOX
     --------------------------------------------------------------- */
  const mapTrigger = document.getElementById('mapTrigger');
  const mapLightbox = document.getElementById('mapLightbox');
  const mapLightboxClose = document.getElementById('mapLightboxClose');

  mapTrigger.addEventListener('click', () => mapLightbox.classList.add('is-open'));
  mapLightboxClose.addEventListener('click', () => mapLightbox.classList.remove('is-open'));
  mapLightbox.addEventListener('click', (e) => {
    if (e.target === mapLightbox) mapLightbox.classList.remove('is-open');
  });

  /* ---------------------------------------------------------------
     5. CHAPTER 3 — ANNOTATED DIAGRAM
     --------------------------------------------------------------- */
  const annotationPoints = document.querySelectorAll('.annotation-point');
  const annotationDisplay = document.getElementById('annotationDisplay');

  annotationPoints.forEach(pt => {
    const show = () => {
      annotationPoints.forEach(p => p.classList.remove('is-active'));
      pt.classList.add('is-active');
      annotationDisplay.style.opacity = 0;
      window.setTimeout(() => {
        annotationDisplay.textContent = pt.dataset.note;
        annotationDisplay.style.opacity = 1;
      }, 150);
    };
    pt.addEventListener('mouseenter', show);
    pt.addEventListener('click', show); // touch devices
  });

  /* ---------------------------------------------------------------
     6. CHAPTER 4 — CINEMATIC VIDEO MODAL
     --------------------------------------------------------------- */
  const videoTrigger = document.getElementById('videoTrigger');
  const cineModal = document.getElementById('cineModal');
  const cineModalClose = document.getElementById('cineModalClose');

  videoTrigger.addEventListener('click', () => cineModal.classList.add('is-open'));
  cineModalClose.addEventListener('click', () => cineModal.classList.remove('is-open'));
  cineModal.addEventListener('click', (e) => {
    if (e.target === cineModal) cineModal.classList.remove('is-open');
  });

  /* ---------------------------------------------------------------
     7. CHAPTER 5 — PAGE-FLIP BOOK
     Pages flip via rotateY. "page" 0 = cover, N = how many pages
     are currently flipped open.
     --------------------------------------------------------------- */
  

  /* ---------------------------------------------------------------
     8. CHAPTER 6 — EXPANDING REFLECTION CARDS
     --------------------------------------------------------------- */
  const reflectionCards = document.querySelectorAll('.reflection-card');
  reflectionCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-open');
    });
  });

});

/* ==========================================================
   NEW WEBSITE INTERACTIONS
========================================================== */
window.addEventListener("click",(e)=>{

if(e.target===videoModal){

videoPlayer.pause();

videoModal.classList.remove("active");

}

});


// ---------- BOARD ZOOM ----------

document.querySelectorAll(".board-image").forEach(img=>{

img.addEventListener("click",()=>{

const overlay=document.createElement("div");

overlay.style.position="fixed";

overlay.style.inset="0";

overlay.style.background="rgba(0,0,0,.92)";

overlay.style.display="flex";

overlay.style.alignItems="center";

overlay.style.justifyContent="center";

overlay.style.zIndex="999999";

const clone=document.createElement("img");

clone.src=img.src;

clone.style.maxWidth="92vw";

clone.style.maxHeight="92vh";

clone.style.cursor="zoom-out";

overlay.appendChild(clone);

overlay.addEventListener("click",()=>{

overlay.remove();

});

document.body.appendChild(overlay);

});

});
/* ===========================
   BOARD VIEWER
=========================== */

function openBoard(src){

    const viewer = document.getElementById("boardViewer");

    const image = document.getElementById("boardViewerImage");

    image.src = src;

    viewer.classList.add("active");

}

function closeBoard(){

    document
        .getElementById("boardViewer")
        .classList.remove("active");

}

document
.getElementById("boardViewer")
.addEventListener("click",function(e){

    if(e.target===this){

        closeBoard();

    }

});

function openBook() {

    document.getElementById("bookModal").classList.add("active");

    if (!$("#flipbook").data("turn")) {

        $("#flipbook").turn({
            width:1100,
            height:720,
            autoCenter:true,
            gradients:true,
            elevation:60
        });

    }

}

function closeBook() {

    document.getElementById("bookModal").classList.remove("active");

}

document.getElementById("bookModal").addEventListener("click", function(e){

    if(e.target===this){

        closeBook();

    }

});
