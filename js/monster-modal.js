window.MonsterModal = (function () {
  'use strict';

  var SAMPLE_MONSTERS = {
    'Biskyva': [
      { Name: 'Biskyva', Difficulty: 'Normal', Level: '293', Element: 'Water', HP: '9.3M', Location: 'Aquastida Central', Drop: 'Abyssal Greatsword;Biskyva Spine;Biskyva Horn;Biskyva Web', Type: 'Boss' },
      { Name: 'Biskyva', Difficulty: 'Hard', Level: '293', Element: 'Water', HP: '18.7M', Location: 'Aquastida Central', Drop: 'Abyssal Greatsword;Biskyva Spine;Biskyva Horn;Corroded Green Crystal', Type: 'Boss' },
      { Name: 'Biskyva', Difficulty: 'Nightmare', Level: '293', Element: 'Water', HP: '25M', Location: 'Aquastida Central', Drop: 'Abyssal Greatsword;Biskyva Spine;Biskyva Horn;Abyssal Katana', Type: 'Boss' },
      { Name: 'Biskyva', Difficulty: 'Ultimate', Level: '293', Element: 'Water', HP: '32M', Location: 'Aquastida Central', Drop: 'Abyssal Greatsword;Biskyva Spine;Biskyva Horn;Biskyva Armor', Type: 'Boss' }
    ]
  };

  var sheetsCache = null;
  var currentGroup = [];
  var currentVariant = null;

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function elemIcon(el) {
    var e = (el || '').toLowerCase();
    if (e === 'fire') return '🔥';
    if (e === 'ice' || e === 'water') return '💧';
    if (e === 'wind') return '🌪️';
    if (e === 'dark') return '🌑';
    if (e === 'light') return '✨';
    if (e === 'earth') return '🧱';
    return '⚪';
  }

  function buildModalHTML() {
    var container = document.getElementById('monsterModal');
    if (!container) return;
    container.className = 'modal-overlay';
    container.innerHTML =
      '<div class="modal-body" style="background: white; max-width: 400px;">' +
        '<button class="modal-close" id="monModalClose">&times;</button>' +
        '<div style="padding: 1.25rem 1.25rem 0.5rem;">' +
          '<h2 id="monModalName" style="font-size:1.4rem;font-weight:800;margin:0">Loading...</h2>' +
        '</div>' +
        '<div class="modal-diff-tabs" id="monModalDiffTabs"></div>' +
        '<div class="detail-image" id="monModalImage" style="height:180px; margin: 0.75rem 1.25rem; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center;">' +
          '<span style="font-size:3rem; opacity:0.3;">👾</span>' +
        '</div>' +
        '<div id="monModalMainBadges" style="padding: 0 1.25rem; display:flex; gap:0.5rem; flex-wrap:wrap;"></div>' +
        '<div id="monModalLocation" style="padding: 0.75rem 1.25rem; font-weight:600; color:#d97706; display:flex; align-items:center; gap:6px;"></div>' +
        '<div class="modal-nav-tabs">' +
          '<div class="modal-nav-tab active" data-tab="info">Info</div>' +
          '<div class="modal-nav-tab" data-tab="compare">Compare</div>' +
        '</div>' +
        '<div id="panel-info" class="detail-panel active" style="padding: 1rem 1.25rem;">' +
           '<div id="monModalInfoRows"></div>' +
           '<div class="m-drops-section" style="margin-top:1rem;">' +
             '<div class="m-drops-title">🗑️ Top Drops:</div>' +
             '<div id="monModalDrops" class="m-drop-list"></div>' +
           '</div>' +
        '</div>' +
        '<div id="panel-compare" class="detail-panel" style="padding: 1rem 1.25rem;">' +
          '<div id="monModalCompareRows"></div>' +
        '</div>' +
        '<div style="height:1.5rem"></div>' +
      '</div>';

    document.getElementById('monModalClose').onclick = close;
    container.onclick = function(e) { if(e.target === container) close(); };

    container.querySelectorAll('.modal-nav-tab').forEach(function(tab) {
      tab.onclick = function() {
        container.querySelectorAll('.modal-nav-tab').forEach(function(t) { t.classList.remove('active'); });
        container.querySelectorAll('.detail-panel').forEach(function(p) { p.classList.remove('active'); });
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
      };
    });
  }

  function populate(group, selectedVariant, startTab) {
    if (!group || !group.length) return;
    currentGroup = group;
    currentVariant = selectedVariant || group[0];

    var mon = currentVariant;
    var name = esc(mon['Name']);
    var difficulty = (mon['Difficulty'] || 'Normal').trim();

    document.getElementById('monModalName').textContent = name;

    // Difficulty Tabs
    var diffTabs = document.getElementById('monModalDiffTabs');
    diffTabs.innerHTML = '';
    group.forEach(function(v) {
      var d = (v['Difficulty'] || 'Normal').trim();
      var btn = document.createElement('div');
      btn.className = 'modal-diff-tab' + (d === difficulty ? ' active' : '');
      btn.textContent = d;
      btn.onclick = function() { populate(group, v, startTab); };
      diffTabs.appendChild(btn);
    });

    // Main Badges (Lv, Elem, HP)
    var badges = document.getElementById('monModalMainBadges');
    var el = mon['Element'] || '';
    badges.innerHTML = 
      '<span class="m-badge lv">Lv.' + esc(mon['Level']) + '</span> ' +
      '<span class="m-badge" style="background:#e0f2fe; color:#0369a1;">' + elemIcon(el) + ' ' + esc(el) + '</span> ' +
      '<span class="m-badge hp">❤️ ' + esc(mon['HP']) + '</span>';

    // Location
    document.getElementById('monModalLocation').innerHTML = '📍 ' + esc(mon['Location']);

    // Info Rows
    var infoRows = document.getElementById('monModalInfoRows');
    infoRows.innerHTML = 
      '<div class="stat-row"><span class="stat-name">Element</span><span class="stat-value">' + (esc(el) || '—') + '</span></div>' +
      '<div class="stat-row"><span class="stat-name">HP</span><span class="stat-value">' + (esc(mon['HP']) || '—') + '</span></div>' +
      '<div class="stat-row"><span class="stat-name">Type</span><span class="stat-value">' + (esc(mon['Type']) || '—') + '</span></div>';

    // Drops
    var drops = (mon['Drop'] || '').split(';').map(function(d) { return d.trim(); }).filter(Boolean);
    var dropEl = document.getElementById('monModalDrops');
    dropEl.innerHTML = '';
    drops.forEach(function(d) {
      var item = document.createElement('div');
      item.className = 'm-drop-item';
      item.innerHTML = '<span>📦</span> ' + esc(d);
      item.onclick = function() {
        if(window.ItemModal) { close(); setTimeout(function(){ window.ItemModal.open(d); }, 200); }
      };
      dropEl.appendChild(item);
    });

    // Compare Tab
    var compareRows = document.getElementById('monModalCompareRows');
    compareRows.innerHTML = '';
    group.forEach(function(v) {
      var d = (v['Difficulty'] || 'Normal').trim();
      var isCurrent = d === difficulty;
      var row = document.createElement('div');
      row.className = 'compare-row' + (isCurrent ? ' current' : '');
      row.innerHTML = 
        '<div class="compare-diff-info">' + 
          (isCurrent ? '🔆' : '🪙') + ' ' + d + 
        '</div>' +
        '<div class="compare-hp">' + esc(v['HP']) + '</div>';
      compareRows.appendChild(row);
    });

    // Switch Tab if requested
    if (startTab) {
      var tabBtn = document.querySelector('.modal-nav-tab[data-tab="' + startTab + '"]');
      if (tabBtn) tabBtn.click();
    }
  }

  function open(monsterName, difficulty, startTab) {
    var overlay = document.getElementById('monsterModal');
    if (!overlay) return;
    buildModalHTML();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    var group = [];
    if (window.ToramSheets && window.ToramSheets.dataState && window.ToramSheets.dataState.fullData) {
      // Find all variants in sheets data
      var data = window.ToramSheets.dataState.fullData;
      group = data.filter(function(r) { return (r['Name'] || '').toLowerCase() === monsterName.toLowerCase(); });
    }
    
    // Fallback to sample if not found
    if (!group.length && SAMPLE_MONSTERS[monsterName]) {
      group = SAMPLE_MONSTERS[monsterName];
    } else if (!group.length) {
       // Manual find in sheets cache if fullData is not synced (e.g. called from external link)
       if (sheetsCache) {
          group = sheetsCache.filter(function(r) { return (r['Name'] || '').toLowerCase() === monsterName.toLowerCase(); });
       }
    }

    if (!group.length) {
      // Last attempt: fetch sheet if logic allows
      var sheetName = (window.ToramSheets && window.ToramSheets.CONFIG.SHEETS.monsters.name) || 'Monsters';
      if (window.ToramSheets && window.ToramSheets.fetchSheet) {
          window.ToramSheets.fetchSheet(sheetName).then(function(csv){
              sheetsCache = window.ToramSheets.parseCSV(csv);
              open(monsterName, difficulty, startTab); // Recursive once cache is filled
          });
          return;
      }
    }

    var selected = null;
    if (difficulty) {
      selected = group.find(function(v) { return (v['Difficulty'] || '').toLowerCase() === difficulty.toLowerCase(); });
    }
    populate(group, selected, startTab);
  }

  function close() {
    var overlay = document.getElementById('monsterModal');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  return { open: open, close: close };
}());
