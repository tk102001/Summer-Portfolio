/* =================================================================
   script.js
   Handles: scroll progress rail, reveal-on-scroll animations,
   current-chapter nav label, subtle parallax on full-bleed images,
   and the interactive "scales of agency" graphic in Chapter 5.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. SCROLL PROGRESS RAIL
     --------------------------------------------------------------- */
  const progressFill = document.getElementById('progressFill');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------------------------------------------------------
     2. REVEAL ON SCROLL
     Any element with class "reveal" fades/slides up into view.
     Landing title lines ("reveal-line") animate on load, not scroll.
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

  // Landing headline: reveal immediately on load for a strong first impression
  window.setTimeout(() => {
    document.querySelectorAll('.landing-title .reveal-line').forEach(el => {
      el.classList.add('is-visible');
    });
  }, 200);

  /* ---------------------------------------------------------------
     3. CURRENT CHAPTER LABEL IN NAV
     Updates the small nav label as each chapter enters the viewport.
     --------------------------------------------------------------- */
  const navChapter = document.getElementById('navChapter');
  const chapters = document.querySelectorAll('.chapter[data-chapter]');

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navChapter.textContent = entry.target.dataset.chapter;
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  chapters.forEach(ch => chapterObserver.observe(ch));

  /* ---------------------------------------------------------------
     4. SUBTLE PARALLAX ON FULL-BLEED IMAGES
     Moves image placeholders slightly slower than scroll for depth.
     Skipped entirely if the visitor prefers reduced motion.
     --------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll('.full-image .image-placeholder');

    function updateParallax() {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elCenter = rect.top + rect.height / 2;
        const distance = (elCenter - viewportCenter) * 0.04; // gentle strength
        el.style.transform = `translateY(${distance}px)`;
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ---------------------------------------------------------------
     5. CHAPTER 5 — INTERACTIVE SCALES OF AGENCY
     Clicking a scale shows a short answer beneath. Replace the copy
     in the `details` object with your own thinking for each scale.
     --------------------------------------------------------------- */
  const scaleButtons = document.querySelectorAll('.scale-item');
  const scaleDetail = document.getElementById('scaleDetail');

  const details = {
    object: "At the scale of the object, the designer's agency is direct but narrow — a bench can invite people to stay, but it can't fix why they didn't feel safe staying in the first place.",
    block: "At the block, agency grows: a street redesign can shift how a whole community moves and gathers. But it still answers to decisions made somewhere else — zoning, ownership, budget.",
    district: "At the district scale, the designer becomes a convener more than an author — coordinating agencies, residents, and capital rather than drawing a single object.",
    policy: "Policy is where urban design's real leverage often sits, and where designers are least trained to act. This is a limit I want to work against.",
    territory: "At the territory scale, the designer's agency is mostly about seeing — naming systems and relationships others haven't yet connected. Building here means building consensus, not form."
  };

  scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scaleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.scale;
      scaleDetail.style.opacity = 0;
      window.setTimeout(() => {
        scaleDetail.textContent = details[key] || '';
        scaleDetail.style.opacity = 1;
      }, 150);
    });
  });

});
