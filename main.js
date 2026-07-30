/**
 * Portfolio Main JavaScript
 * - Mobile navigation toggle
 * - Active nav link on scroll
 * - Smooth scroll polyfill fallback
 * - Form validation enhancement
 * - Current year updater
 */

(function() {
  'use strict';

  // ==========================================
  // DOM Elements
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const currentYearEl = document.getElementById('current-year');
  const contactForm = document.querySelector('.contact__form');

  // ==========================================
  // Mobile Navigation Toggle
  // ==========================================
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('is-open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ==========================================
  // Active Nav Link on Scroll
  // ==========================================
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ==========================================
  // Current Year
  // ==========================================
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // Form Validation Enhancement
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      let isValid = true;
      const requiredFields = ['name', 'email', 'message'];
      
      requiredFields.forEach(function(field) {
        const input = document.getElementById('contact-' + field);
        const value = data[field] ? data[field].trim() : '';
        
        if (!value) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.style.borderColor = '';
          input.setAttribute('aria-invalid', 'false');
        }
      });
      
      // Email validation
      const emailInput = document.getElementById('contact-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
        emailInput.style.borderColor = '#ef4444';
      }
      
      if (isValid) {
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mengirim...</span>';
        
        setTimeout(function() {
          submitBtn.innerHTML = '<span>✓ Terkirim!</span>';
          submitBtn.style.background = '#22c55e';
          
          setTimeout(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
          }, 2000);
        }, 1500);
        
        // TODO: Replace with actual form submission
        console.log('Form data:', data);
      }
    });
    
    // Clear error styles on input
    contactForm.querySelectorAll('.form-input').forEach(function(input) {
      input.addEventListener('input', function() {
        this.style.borderColor = '';
        this.removeAttribute('aria-invalid');
      });
    });
  }

  // ==========================================
  // Intersection Observer for Fade-in Animations
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply fade-in to sections
  document.querySelectorAll('section').forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(24px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(section);
  });

  // ==========================================
  // Header Shadow on Scroll
  // ==========================================
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 10) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

})();
