// ============================================================
// ToramDB — main.js
// ============================================================

(function () {
  'use strict';

  // Helper: debounce
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  /* ---------- Hamburger / Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
  }

  /* ---------- Theme Toggle (Dark Mode) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  if (themeToggle) {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
      }
    });
  }

  /* ---------- Back-to-top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
      const fabContainer = document.querySelector('.floating-action-buttons');
      window.addEventListener('scroll', function () {
          if (window.scrollY > 300) {
              fabContainer.style.display = 'flex';
          } else {
              fabContainer.style.display = 'none';
          }
      });
      backToTop.addEventListener('click', function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  /* ---------- Hero search redirect ---------- */
  var heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = document.getElementById('heroSearchInput').value.trim();
      var cat = document.getElementById('heroSearchCategory');
      var page = cat ? cat.value : 'items';
      if (q) {
        window.location.href = 'pages/' + page + '.html?q=' + encodeURIComponent(q);
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var activePage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.endsWith(activePage)) {
      link.classList.add('active');
    }
  });

  /* ---------- Animate numbers in hero stats ---------- */
  function setupCounters() {
    var statNums = document.querySelectorAll('[data-count]');
    if (statNums.length === 0) return;
    
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { observer.observe(el); });
  }

  setupCounters();

  // Expose globally so sheets.js can re-trigger after loading stats from Sheet
  window.animateCounters = setupCounters;

  function animateCount(el) {
    var target   = parseInt(el.dataset.count, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1200;
    var start    = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
}());