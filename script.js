/* ============================================
   SSMEDIA – script.js
   ============================================ */

'use strict';

// =============================================
// 1. NAVBAR – sticky + mobile toggle
// =============================================
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = navLinks.querySelectorAll('a');

  // Scroll: add class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        link.style.color = (scrollY >= top && scrollY < top + height)
          ? 'var(--gold)' : '';
      }
    });
  }, { passive: true });
})();

// =============================================
// 2. SCROLL REVEAL
// =============================================
(function () {
  const revealEls = document.querySelectorAll('.reveal, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

// =============================================
// 3. SKILL BAR ANIMATION
// =============================================
(function () {
  const bars = document.querySelectorAll('.bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => observer.observe(b));
})();

// =============================================
// 4. PORTFOLIO FILTER
// =============================================
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          requestAnimationFrame(() => {
            item.style.animation = 'fadeIn 0.4s ease both';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// =============================================
// 5. GALLERY LIGHTBOX
// =============================================
(function () {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  const srcs = Array.from(galleryItems).map(item => item.dataset.src);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = srcs[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + srcs.length) % srcs.length;
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = srcs[currentIndex];
      lightboxImg.style.opacity = 1;
    }, 150);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % srcs.length;
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = srcs[currentIndex];
      lightboxImg.style.opacity = 1;
    }, 150);
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // Transition for image
  lightboxImg.style.transition = 'opacity 0.15s ease';
})();

// =============================================
// 6. BACK TO TOP BUTTON
// =============================================
(function () {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// =============================================
// 7. HERO PARTICLE CANVAS
// =============================================
(function () {
  const container = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.5, 2.2),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.6, -0.15),
      alpha: rand(0.2, 0.7),
      color: Math.random() > 0.6 ? '#F5B301' : '#E8001D',
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0008;

      if (p.y < -5 || p.alpha <= 0) {
        Object.assign(p, createParticle());
        p.y = H + 5;
        p.alpha = rand(0.2, 0.7);
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();

// =============================================
// 8. REVIEW CAROUSEL FOR MOBILE
// =============================================
(function () {
  const track = document.querySelector('.review-cards');
  const prev = document.querySelector('.review-nav-btn.prev');
  const next = document.querySelector('.review-nav-btn.next');
  if (!track || !prev || !next) return;

  const getScrollAmount = () => {
    const card = track.querySelector('.review-card');
    return card ? card.getBoundingClientRect().width + 18 : 300;
  };

  next.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
})();

// =============================================
// 8.1 ABOUT MOBILE IMAGE LAYOUT
// =============================================
// Mobile-only layout is handled via CSS for a top badge and side-by-side cards.

// =============================================
// 9. REVIEW FORM VALIDATION & MODAL MANAGEMENT
// =============================================
(function () {
  const form = document.getElementById('reviewForm');
  const starPicker = document.getElementById('starPicker');
  const success = document.getElementById('formSuccess');
  const reviewContainer = document.querySelector('.review-cards');
  const viewMoreBtn = document.getElementById('viewMoreReviewsBtn');
  const viewMoreWrapper = document.getElementById('viewMoreReviewsWrapper');
  const reviewsModal = document.getElementById('reviewsModal');
  const closeModalBtn = document.getElementById('closeReviewsModal');
  const modalBackdrop = document.getElementById('reviewsModalBackdrop');
  const allReviewsContainer = document.getElementById('allReviewsContainer');
  const isAdmin = localStorage.getItem('ssmediaAdmin') === 'true';
  let ratingValue = 0;
  let allReviews = [];
  const REVIEWS_PER_PAGE = 6;

  // Admin delete control: set localStorage.setItem('ssmediaAdmin', 'true') in browser console
  if (!form || !starPicker || !success || !reviewContainer) return;
  document.documentElement.classList.toggle('admin-active', isAdmin);

  function getInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }

  function addRemoveButton(card) {
    if (!isAdmin) return;
    if (card.querySelector('.review-remove-btn')) return;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'review-remove-btn';
    removeBtn.setAttribute('aria-label', 'Remove review');
    removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    removeBtn.addEventListener('click', () => card.remove());
    const top = card.querySelector('.review-card-top');
    if (top) top.appendChild(removeBtn);
  }

  // Generate a visual star row for a review rating.
  // This keeps the review card styling consistent with the existing cinematic dark theme.
  function buildRatingStars(rating = 0) {
    const starsWrapper = document.createElement('div');
    starsWrapper.className = 'review-stars';
    const maxStars = 5;
    const value = Number(rating) || 0;

    for (let i = 1; i <= maxStars; i += 1) {
      const star = document.createElement('span');
      star.className = 'review-star';
      star.textContent = '★';
      star.setAttribute('aria-hidden', 'true');
      star.style.color = i <= value ? 'var(--gold)' : 'rgba(255,255,255,0.25)';
      starsWrapper.appendChild(star);
    }

    return starsWrapper;
  }

  // Build a review card from Firestore data or form submission values.
  function createReviewCard(name, eventType, feedback, rating = 0) {
    const card = document.createElement('article');
    card.className = 'review-card';

    const top = document.createElement('div');
    top.className = 'review-card-top';

    const stars = buildRatingStars(rating);

    const tag = document.createElement('span');
    tag.className = 'review-tag';
    tag.textContent = eventType || 'Review';

    const reviewMeta = document.createElement('div');
    reviewMeta.className = 'review-meta';
    reviewMeta.append(stars, tag);
    top.append(reviewMeta);
    card.appendChild(top);

    if (feedback) {
      const text = document.createElement('p');
      text.className = 'review-text';
      text.textContent = feedback;
      card.appendChild(text);
    }

    const reviewer = document.createElement('div');
    reviewer.className = 'reviewer';

    const avatar = document.createElement('div');
    avatar.className = 'reviewer-avatar';
    avatar.textContent = getInitials(name || 'Client');

    const reviewerInfo = document.createElement('div');
    const reviewerName = document.createElement('strong');
    reviewerName.textContent = name;
    const reviewerEvent = document.createElement('span');
    reviewerEvent.textContent = eventType;

    reviewerInfo.append(reviewerName, reviewerEvent);
    reviewer.append(avatar, reviewerInfo);
    card.appendChild(reviewer);

    addRemoveButton(card);
    return card;
  }

  function initializeExistingReviewControls() {
    reviewContainer.querySelectorAll('.review-card').forEach(addRemoveButton);
  }

  // Render visible reviews (first 6) on main page
  function renderVisibleReviews(reviews) {
    reviewContainer.innerHTML = '';

    const visibleReviews = reviews.slice(0, REVIEWS_PER_PAGE);

    if (!Array.isArray(reviews) || reviews.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'review-empty-message';
      emptyMessage.textContent = 'No reviews found yet. Submit the first review to see it live here.';
      reviewContainer.appendChild(emptyMessage);
      return;
    }

    const fragment = document.createDocumentFragment();

    visibleReviews.forEach((review) => {
      const card = createReviewCard(
        review.name || 'Customer',
        review.eventType || 'Review',
        review.feedback || '',
        review.rating || 0,
      );

      if (review.id) {
        card.dataset.reviewId = review.id;
      }

      fragment.appendChild(card);
    });

    reviewContainer.appendChild(fragment);

    // Show/hide "View More Reviews" button based on review count
    if (reviews.length > REVIEWS_PER_PAGE) {
      viewMoreWrapper.style.display = 'flex';
    } else {
      viewMoreWrapper.style.display = 'none';
    }
  }

  // Render all reviews in modal
  function renderAllReviewsInModal(reviews) {
    allReviewsContainer.innerHTML = '';

    if (!Array.isArray(reviews) || reviews.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'reviews-modal-empty';
      emptyState.innerHTML = '<p>No reviews available yet.</p>';
      allReviewsContainer.appendChild(emptyState);
      return;
    }

    const fragment = document.createDocumentFragment();

    reviews.forEach((review) => {
      const card = createReviewCard(
        review.name || 'Customer',
        review.eventType || 'Review',
        review.feedback || '',
        review.rating || 0,
      );

      if (review.id) {
        card.dataset.reviewId = review.id;
      }

      fragment.appendChild(card);
    });

    allReviewsContainer.appendChild(fragment);
  }

  // Modal management functions
  function openModal() {
    reviewsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderAllReviewsInModal(allReviews);
  }

  function closeModal() {
    reviewsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Modal event listeners
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      // Only close if clicking directly on backdrop, not on content
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Keyboard handling for modal - ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewsModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Subscribe to Firestore reviews with real-time updates.
  // This listener updates the review container instantly when reviews are added, changed, or deleted.
  function startReviewListener() {
    if (typeof window.subscribeToReviews !== 'function') {
      console.warn('Firestore subscription helper not loaded.');
      return;
    }

    window.subscribeToReviews(
      (reviews) => {
        allReviews = reviews;
        renderVisibleReviews(reviews);
      },
      (error) => {
        reviewContainer.innerHTML = '';
        const errorMessage = document.createElement('div');
        errorMessage.className = 'review-error-message';
        errorMessage.textContent = 'Unable to load reviews right now. Please refresh later.';
        reviewContainer.appendChild(errorMessage);
        console.error('Firestore review fetch error:', error);
      },
    );
  }

  startReviewListener();

  starPicker.addEventListener('click', (event) => {
    const target = event.target.closest('label');
    if (!target) return;
    const inputId = target.getAttribute('for');
    const input = document.getElementById(inputId);
    if (!input) return;
    input.checked = true;
    ratingValue = Number(input.value);
    updateStars(ratingValue);
  });

  function updateStars(value) {
    const labels = Array.from(starPicker.querySelectorAll('label'));
    labels.forEach(label => {
      const associated = document.getElementById(label.getAttribute('for'));
      if (!associated) return;
      label.style.color = Number(associated.value) <= value ? 'var(--gold)' : 'rgba(255,255,255,0.25)';
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name').toString().trim();
    const eventType = formData.get('eventType').toString().trim();
    const feedback = formData.get('feedback').toString().trim();
    const rating = formData.get('rating');

    if (!rating || !name || !eventType) {
      success.textContent = 'Please select a star rating, your name, and event type.';
      success.style.color = '#ff6b6b';
      return;
    }

    success.style.color = 'var(--gold)';
    success.textContent = 'Submitting your review...';

    try {
      if (typeof window.saveReviewToFirestore !== 'function') {
        throw new Error('Firestore helper is not loaded.');
      }

      await window.saveReviewToFirestore({
        name,
        eventType,
        rating: Number(rating),
        feedback,
      });
    } catch (error) {
      console.error('Firestore review submit error:', error);
      success.textContent = 'Unable to save review right now. Please try again later.';
      success.style.color = '#ff6b6b';
      return;
    }

    // Rely on Firestore onSnapshot to render the new review live.
    // This avoids duplicate cards and keeps the review container in sync with the database.
    success.style.color = 'var(--gold)';
    success.textContent = 'Thank you! Your review has been added.';
    form.reset();
    ratingValue = 0;
    updateStars(0);

    setTimeout(() => { success.textContent = ''; }, 7000);
  });

  initializeExistingReviewControls();
})();

// =============================================
// 10. SMOOTH SCROLL for anchor links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =============================================
// 9. COUNTER ANIMATION (Stats)
// =============================================
(function () {
  const stats = document.querySelectorAll('.stat-num');
  const targets = [5000, 20, 300];
  let animated = false;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animateStat = (el, target, duration = 1200) => {
    const suffixMatch = el.textContent.match(/[^0-9]+/);
    const suffix = suffixMatch ? suffixMatch[0] : '+';
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    if (animated) return;
    if (entries.some(entry => entry.isIntersecting)) {
      animated = true;
      stats.forEach((el, i) => {
        const target = targets[i] || 0;
        animateStat(el, target, 1200 + i * 120);
      });
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  if (stats.length > 0) observer.observe(stats[0]);
})();

// =============================================
// HERO PORTRAIT SLIDESHOW
// =============================================
(function () {
  const heroPhoto = document.getElementById('directorPhoto');
  if (!heroPhoto) return;

  const heroImages = [
    'Daddy.jpg',
    '12.jpg',
    'ARJ05405.JPG',
    '555.jpg',
    'EDIT 1.jpg',
    'vee.jpg',
  ];

  const currentFile = heroPhoto.src.split('/').pop();
  let activeIndex = heroImages.indexOf(currentFile);
  if (activeIndex === -1) activeIndex = 0;

  const rotateHeroImage = () => {
    heroPhoto.style.opacity = '0';
    setTimeout(() => {
      activeIndex = (activeIndex + 1) % heroImages.length;
      heroPhoto.src = heroImages[activeIndex];
      heroPhoto.alt = `Hero image ${activeIndex + 1}`;
      heroPhoto.style.opacity = '1';
    }, 500);
  };

  setInterval(rotateHeroImage, 3000);
})();

// =============================================
// FLOATING CLIENT LOGOS - PARALLAX & INTERACTIONS
// =============================================
(function () {
  const logoContainer = document.querySelector('.logo-container');
  if (!logoContainer) return;

  const floatingLogos = document.querySelectorAll('.floating-logo');
  const logoShowcase = document.querySelector('.logo-showcase');

  // Parallax effect on mouse move
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 15;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 15;

      floatingLogos.forEach((logo, i) => {
        const multiplier = (i % 2 === 0 ? 1 : -1) * 0.4;
        logo.style.transform = `translate(${xPercent * multiplier}px, ${yPercent * multiplier}px)`;
      });
    });
  }

  // Intersection Observer for reveal animation
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '50px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  if (logoShowcase) {
    observer.observe(logoShowcase);
  }

  // Enhanced hover effects
  floatingLogos.forEach((logo) => {
    logo.addEventListener('mouseenter', () => {
      logo.style.zIndex = '10';
    });

    logo.addEventListener('mouseleave', () => {
      logo.style.zIndex = '1';
    });
  });
})();

// =============================================
// 10. CSS Keyframe injection for filterIn
// =============================================
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();
