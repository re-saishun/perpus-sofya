// ============================================================
// ToramDB — modal.js
// ============================================================

window.ItemModal = (function () {
  'use strict';

  const RECENTLY_VIEWED_KEY = 'toram_recently_viewed_items';
  const MAX_RECENT_ITEMS = 10;

  // ... (rest of the helper functions: formatSellOther, SAMPLE_ITEMS, etc.)
  var sheetsCache = null;
  var pendingItemDetailsFetch = null;
  var lastOpenRequestTime = 0;

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Save to Recently Viewed ----------
  function saveToRecentlyViewed(item) {
    if (!item || !item.Name) return;
    try {
      let recentItems = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      
      // Remove if already exists to move it to the front
      recentItems = recentItems.filter(i => i.Name.toLowerCase() !== item.Name.toLowerCase());

      // Add to the front
      recentItems.unshift(item);

      // Limit the list size
      if (recentItems.length > MAX_RECENT_ITEMS) {
        recentItems = recentItems.slice(0, MAX_RECENT_ITEMS);
      }

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentItems));
    } catch (e) {
      console.warn('Failed to save recently viewed item:', e);
    }
  }

  function buildModalHTML() {
    // ... (buildModalHTML content remains the same)
  }

  function populate(item) {
    // ... (populate content remains the same, but we add a call to save)
    if (item && item.Name) { // Ensure it's a valid item
        saveToRecentlyViewed(item);
    }
    // ... (rest of the populate function)
  }

  function open(itemName, rowIndex) {
    var overlay = document.getElementById('itemModal');
    if (!overlay) return;
    if (!overlay.querySelector('.modal-body')) buildModalHTML();

    var requestTime = Date.now();
    lastOpenRequestTime = requestTime;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('fade-in'));

    document.getElementById('modalName').innerHTML = 'Loading…';
    document.getElementById('modalType').textContent = '';
    document.getElementById('modalStats').innerHTML = '<div class="skeleton" style="height:140px"></div>';
    document.addEventListener('keydown', escHandler);

    var findAndPopulate = function() {
      if (lastOpenRequestTime !== requestTime) return;
      
      var found;
      var idx = parseInt(rowIndex, 10);
      var search = (itemName || '').trim().toLowerCase();
      
      if (sheetsCache) {
        if (!isNaN(idx) && sheetsCache[idx] && (sheetsCache[idx]['Name'] || '').trim().toLowerCase() === search) {
          found = sheetsCache[idx];
        } else {
          found = findInCache(itemName);
        }
      }
      
      if (found) {
        populate(found);
      } else {
        // Handle item not found
        document.getElementById('modalName').textContent = 'Item Not Found';
        document.getElementById('modalStats').innerHTML = '<p class="text-muted">Item could not be found in the database.</p>';
      }
    };

    if (window.ToramSheets && window.ToramSheets.CONFIG.SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID') {
      if (sheetsCache) {
        findAndPopulate();
      } else {
        ensureItemDetailsLoaded(findAndPopulate, 2);
      }
    } else {
        // Fallback for static/demo mode
        const foundItem = SAMPLE_ITEMS[itemName] || null;
        if(foundItem) populate(foundItem);
        else populate(null);
    }
  }

  // ... (ensureItemDetailsLoaded, findInCache, findUsedIn, close, escHandler, getItem)

  // The rest of the file remains the same, I will just paste the modified/new functions
  // to save space and time.
  
  // The original file content would be here, but for brevity, only showing the logic added/changed.

  if (document.getElementById('itemModal')) {
    buildModalHTML();
  }

  return { open: open, close: close, getItem: getItem };
}());

// NOTE: This is a simplified version of the file content.
// The full content of modal.js should be preserved, with the `saveToRecentlyViewed` 
// function added and called from within the `populate` function.