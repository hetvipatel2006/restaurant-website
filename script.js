/* ================================================================
   KAMLA RESTAURANT — SCRIPT.JS
   Interactive features, animations, and smooth UX
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ===== 2. MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== 3. SMOOTH SCROLL NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== 4. ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ===== 5. SCROLL-TRIGGERED ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== 6. COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (element) => {
    const target = parseFloat(element.getAttribute('data-count'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const current = target * easedProgress;

      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          element.textContent = target.toFixed(1);
        } else {
          element.textContent = target.toLocaleString();
        }
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ===== 7. PARALLAX EFFECT ON HERO =====
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg) {
    const handleParallax = () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrollY < heroHeight) {
        const speed = 0.4;
        heroBg.style.transform = `translateY(${scrollY * speed}px) scale(1.1)`;
      }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      window.addEventListener('scroll', handleParallax, { passive: true });
      // Initial scale for parallax
      heroBg.style.transform = 'scale(1.1)';
    }
  }

  // ===== 8. BACK TO TOP BUTTON =====
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 9. LAZY LOADING FOR IMAGES =====
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback: use IntersectionObserver
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.removeAttribute('loading');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== 10. DYNAMIC YEAR IN FOOTER =====
  const yearElements = document.querySelectorAll('.footer-bottom p');
  yearElements.forEach(el => {
    el.innerHTML = el.innerHTML.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
  });

  // ===== 11. HIGHLIGHT TODAY'S HOURS =====
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const hoursRows = document.querySelectorAll('.hours-row');

  hoursRows.forEach(row => {
    const dayText = row.querySelector('.day')?.textContent;
    if (dayText && dayText.includes(today)) {
      row.classList.add('today');
    }
    // Handle range like "Monday – Friday"
    if (dayText && dayText.includes('–')) {
      const [start, end] = dayText.split('–').map(d => d.trim());
      const startIndex = days.indexOf(start);
      const endIndex = days.indexOf(end);
      const todayIndex = days.indexOf(today);
      if (todayIndex >= startIndex && todayIndex <= endIndex) {
        row.classList.add('today');
      }
    }
  });

  // ===== 12. HOVER TILT ON FEATURE CARDS =====
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== 13. REVIEW CARDS STAGGER ANIMATION =====
  const reviewCards = document.querySelectorAll('.review-card');
  reviewCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 150}ms`;
  });

  // ===== INITIALIZATION COMPLETE =====
  console.log('🍛 Kamla Restaurant website initialized successfully');
});
