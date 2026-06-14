/* ==========================================================================
   ATITHÉ — Interactive Logic & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollAnimations();
  initParallaxEffects();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  if (!toggleBtn || !navbar) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('active');
    navbar.classList.toggle('active');
    body.classList.toggle('menu-open');
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    navbar.classList.remove('active');
    body.classList.remove('menu-open');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside of the navbar
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && !navbar.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * Sticky Header Scroll State
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run initially
}

/**
 * Scroll Triggered Fade-ins and Line Animations
 */
function initScrollAnimations() {
  // Stagger index utility for child lists
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.animate-on-scroll');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', index);
    });
  });

  const animateElements = document.querySelectorAll('.animate-on-scroll, .gold-line-draw');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // offset bottom slightly
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Unobserve after animating in to optimize performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(element => {
      animationObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    animateElements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

/**
 * Parallax Background Scrolling Effects
 */
function initParallaxEffects() {
  const heroBg = document.querySelector('.hero-bg');
  const occasionSection = document.querySelector('.occasion-section');
  const occasionBg = document.querySelector('.occasion-bg');

  // RequestAnimationFrame throttled parallax for buttery smoothness
  let ticking = false;

  const handleScrollParallax = () => {
    const scrollY = window.scrollY;

    // 1. Hero Parallax
    if (heroBg && scrollY < window.innerHeight) {
      // Scale and shift slightly
      const yValue = scrollY * 0.35;
      heroBg.style.transform = `scale(1.05) translateY(${yValue}px)`;
    }

    // 2. Occasion Section Parallax
    if (occasionSection && occasionBg) {
      const rect = occasionSection.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Only perform calculation if section is in viewport
      if (rect.top < viewHeight && rect.bottom > 0) {
        // Calculate percentage of section scrolled past the bottom of viewport
        const totalDistance = viewHeight + rect.height;
        const currentDistance = viewHeight - rect.top;
        const percentage = currentDistance / totalDistance;

        // Shift position: range from -10% to 10% translation
        const yOffset = (percentage - 0.5) * 80; // pixels movement
        occasionBg.style.transform = `translateY(${yOffset}px)`;
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScrollParallax);
      ticking = true;
    }
  }, { passive: true });
}
