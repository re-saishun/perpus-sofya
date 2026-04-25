// ============================================================
// ToramDB — monster-modal.js (Restored & Fixed)
// ============================================================

window.MonsterModal = (function () {
  'use strict';

  const RECENTLY_VIEWED_KEY = 'toram_recently_viewed_monsters';
  const MAX_RECENT_MONSTERS = 10;

  var sheetsCache = null;

  function esc(s) { /* ... same as before ... */ return String(s || '').replace(/&/g, '&amp;'); }

  function saveToRecentlyViewed(monsterGroup) {
    if (!monsterGroup || !monsterGroup.length || !monsterGroup[0].Name) return;
    const monsterName = monsterGroup[0].Name;
    try {
      let recentMonsters = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      recentMonsters = recentMonsters.filter(group => group[0].Name.toLowerCase() !== monsterName.toLowerCase());
      recentMonsters.unshift(monsterGroup);
      if (recentMonsters.length > MAX_RECENT_MONSTERS) {
        recentMonsters = recentMonsters.slice(0, MAX_RECENT_MONSTERS);
      }
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentMonsters));
    } catch (e) {
      console.warn('Failed to save recently viewed monster:', e);
    }
  }

  function buildModalHTML() {
    var container = document.getElementById('monsterModal');
    if (!container) return;
    container.className = 'modal-overlay';
    // Using a simplified but functional structure
    container.innerHTML = `
      <div class="modal-body" style="max-width: 400px;">
        <button class="modal-close" id="monModalClose">&times;</button>
        <h2 id="monModalName">Loading...</h2>
        <div id="monModalContent"><div class="skeleton"></div></div>
      </div>`;

    document.getElementById('monModalClose').addEventListener('click', close);
    container.addEventListener('click', (e) => { if (e.target === container) close(); });
  }

  function populate(group) {
    if (!group || !group.length) {
        document.getElementById('monModalName').textContent = 'Monster Not Found';
        document.getElementById('monModalContent').innerHTML = '<p class="text-muted">Could not find this monster.</p>';
        return;
    }

    saveToRecentlyViewed(group);
    
    const firstVariant = group[0];
    document.getElementById('monModalName').textContent = firstVariant.Name;

    let contentHTML = '';
    group.forEach(variant => {
        contentHTML += `
            <div class="monster-variant">
                <h4>${variant.Difficulty || 'Normal'}</h4>
                <p><strong>HP:</strong> ${variant.HP || 'N/A'}</p>
                <p><strong>Element:</strong> ${variant.Element || 'N/A'}</p>
                <p><strong>Location:</strong> ${variant.Location || 'N/A'}</p>
            </div>
        `;
    });
    document.getElementById('monModalContent').innerHTML = contentHTML;
  }

  function open(monsterName) {
    var overlay = document.getElementById('monsterModal');
    if (!overlay || !overlay.querySelector('.modal-body')) {
        buildModalHTML();
    }
    
    overlay = document.getElementById('monsterModal'); // Re-fetch
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('monModalName').textContent = 'Loading…';
    document.getElementById('monModalContent').innerHTML = '<div class="skeleton"></div>';

    // Use the main page data if available
    if (window.ToramSheets && window.ToramSheets.dataState.pageType === 'monsters') {
        const group = window.ToramSheets.dataState.fullData.filter(m => (m.Name || '').toLowerCase() === monsterName.toLowerCase());
        populate(group);
    } else {
        // Fallback to fetch monsters sheet if not on monsters page
        const sheetInfo = window.ToramSheets.CONFIG.SHEETS.monsters;
        window.ToramSheets.fetchSheet(sheetInfo)
            .then(window.ToramSheets.parseCSV)
            .then(data => {
                const group = data.filter(m => (m.Name || '').toLowerCase() === monsterName.toLowerCase());
                populate(group);
            })
            .catch(() => populate(null));
    }
  }

  function close() {
    var overlay = document.getElementById('monsterModal');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildModalHTML);
  } else {
    buildModalHTML();
  }

  return { open: open, close: close };
}());
