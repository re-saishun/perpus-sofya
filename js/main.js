// ============================================================
// ToramDB — main.js (Fixed Null Reference)
// ============================================================

(function () {
  'use strict';

  // Helper: debounce (if needed, otherwise can be removed)
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /* ---------- Hamburger / Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', this.classList.contains('open'));
    });
  }

  /* ---------- Theme Toggle (Dark Mode) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    }
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const isDarkMode = body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }

  /* ---------- Back-to-top & Floating Action Buttons ---------- */
  const fabContainer = document.querySelector('.floating-action-buttons');
  // **THE FIX IS HERE:** Check if the container actually exists on the page.
  if (fabContainer) {
    const backToTop = document.getElementById('backToTop');
    
    // Only show the button container on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        fabContainer.style.display = 'flex';
      } else {
        fabContainer.style.display = 'none';
      }
    });

    // Ensure the backToTop button exists before adding its event listener
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------- Hero search redirect ---------- */
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const q = document.getElementById('heroSearchInput').value.trim();
      const cat = document.getElementById('heroSearchCategory');
      if (q && cat) {
        window.location.href = `pages/${cat.value}.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  /* ---------- Active nav link ---------- */
  try {
    const activePage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.endsWith(activePage)) {
        link.classList.add('active');
      }
    });
  } catch (e) {
    console.warn('Could not set active nav link', e);
  }

}());
