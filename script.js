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
  const bookPages = document.querySelectorAll('.book-page');
  const bookPrev = document.getElementById('bookPrev');
  const bookNext = document.getElementById('bookNext');
  const bookPageLabel = document.getElementById('bookPageLabel');
  const pageLabels = ['Cover', 'Page 1', 'Page 2', 'Page 3', 'Back cover'];

  let currentPage = 0;
  const totalPages = bookPages.length;

  function renderBook() {
    bookPages.forEach((pg, i) => {
      pg.classList.toggle('is-flipped', i < currentPage);
    });
    bookPageLabel.textContent = pageLabels[currentPage] || '';
    bookPrev.disabled = currentPage === 0;
    bookNext.disabled = currentPage >= totalPages;
  }
  renderBook();

  bookNext.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage += 1; renderBook(); }
  });
  bookPrev.addEventListener('click', () => {
    if (currentPage > 0) { currentPage -= 1; renderBook(); }
  });

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

// ---------- BOOK MODAL ----------

const openBook = document.querySelector(".open-book-btn");
const bookModal = document.getElementById("bookModal");
const closeBook = document.querySelector(".close-book");

if(openBook){

openBook.addEventListener("click",()=>{

bookModal.classList.add("active");

});

}

if(closeBook){

closeBook.addEventListener("click",()=>{

bookModal.classList.remove("active");

});

}

window.addEventListener("click",(e)=>{

if(e.target===bookModal){

bookModal.classList.remove("active");

}

});


// ---------- VIDEO CAROUSEL ----------

const playButtons=document.querySelectorAll(".play-video");

const videoModal=document.getElementById("videoModal");

const videoPlayer=document.getElementById("chapterVideo");

const videoSource=videoPlayer.querySelector("source");

const closeVideo=document.querySelector(".close-video");

playButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

videoSource.src=btn.dataset.video;

videoPlayer.load();

videoPlayer.play();

videoModal.classList.add("active");

});

});

if(closeVideo){

closeVideo.addEventListener("click",()=>{

videoPlayer.pause();

videoModal.classList.remove("active");

});

}

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
