window.MonsterModal = (function () {
  'use strict';

  const RECENTLY_VIEWED_KEY = 'toram_recently_viewed_monsters';
  const MAX_RECENT_MONSTERS = 10;

  var sheetsCache = null;
  var currentGroup = [];
  var currentVariant = null;

  // ... (rest of the helper functions: getSafeId, esc, elemIcon, etc.)

  function saveToRecentlyViewed(monsterGroup) {
    if (!monsterGroup || !monsterGroup.length || !monsterGroup[0].Name) return;
    const monsterName = monsterGroup[0].Name;

    try {
      let recentMonsters = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      
      // Remove if already exists to move it to the front
      recentMonsters = recentMonsters.filter(group => group[0].Name.toLowerCase() !== monsterName.toLowerCase());

      // Add the new group to the front
      recentMonsters.unshift(monsterGroup);

      // Limit the list size
      if (recentMonsters.length > MAX_RECENT_MONSTERS) {
        recentMonsters = recentMonsters.slice(0, MAX_RECENT_MONSTERS);
      }

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentMonsters));
    } catch (e) {
      console.warn('Failed to save recently viewed monster:', e);
    }
  }

  function buildModalHTML() {
    // ... (buildModalHTML content remains the same)
  }

  function populate(group, selectedVariant, startTab) {
    if (!group || !group.length) {
       // ... (error handling remains the same)
       return;
    }
    
    // Save the valid group to recently viewed
    saveToRecentlyViewed(group);

    currentGroup = group;
    currentVariant = selectedVariant || group[0];
    
    // ... (rest of the populate function remains the same)
  }

  function open(monsterName, difficulty, startTab, initialGroup) {
    // ... (open function logic remains the same)
  }

  function close() {
    // ... (close function logic remains the same)
  }
  
  // The rest of the file remains the same.
  // This is a conceptual representation of the changes.

  return { open: open, close: close };
}());

// NOTE: This shows only the conceptual changes. The full monster-modal.js content
// should be preserved, with the `saveToRecentlyViewed` function added and called from `populate`.