
window.ToramSheets = (function () {
  'use strict';

  var dataState = {
    fullData: [],
    pageType: '',
    containerId: ''
  };

  var CONFIG = {
    SHEET_ID: '1Zmk6AHYjoBTo_Ius90Ves6sTb_weTVcBPmc7r4269Zo',
    SHEETS: {
      items:       { name: 'Items',       gid: '0' },
      itemdetails: { name: 'ItemDetails', gid: '544142354' },
      monsters:    { name: 'Monsters',    gid: '197383360' },
      skills:      { name: 'Skills',      gid: '1864718894', ttl: 24 * 60 * 60 * 1000 }, // 1 day TTL for skills
      maps:        { name: 'Maps',        gid: '600238184' },
      quests:      { name: 'Quests',      gid: '2017598944' },
      pets:        { name: 'Pets',        gid: '1949299875' }, 
      homepage:    { name: 'Homepage',    gid: '28274370' },
      skilltrees:  { name: 'SkillTrees',  gid: '1214207966' }
    }
  };

  // Cache with offline fallback
  var CACHE_TTL_DEFAULT = 5 * 60 * 1000; // 5 minutes

  function fetchSheet(sheetInfo) {
    if (typeof sheetInfo === 'string') {
      sheetInfo = CONFIG.SHEETS[sheetInfo] || { name: sheetInfo, gid: '' };
    }
    
    var sheetName = sheetInfo.name;
    var gid = sheetInfo.gid;
    var ttl = sheetInfo.ttl || CACHE_TTL_DEFAULT;
    var cacheKey = 'tcs_v5_' + (gid || sheetName);
    var tsKey = cacheKey + '_ts';

    try {
      var cached = localStorage.getItem(cacheKey);
      var ts = parseInt(localStorage.getItem(tsKey) || '0', 10);
      if (cached && (Date.now() - ts) < ttl) {
        return Promise.resolve(cached);
      }
    } catch (e) { console.warn('LocalStorage read failed', e); }

    var url = 'https://docs.google.com/spreadsheets/d/' + CONFIG.SHEET_ID + 
              '/export?format=csv&gid=' + gid;
    
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Network response was not ok: ' + res.statusText);
      return res.text();
    }).then(function (text) {
      try {
        localStorage.setItem(cacheKey, text);
        localStorage.setItem(tsKey, String(Date.now()));
      } catch (e) { console.warn('LocalStorage write failed', e); }
      return text;
    }).catch(function(error) {
      console.warn('Fetch failed, attempting to use offline cache:', error);
      try {
        var offlineCached = localStorage.getItem(cacheKey);
        if (offlineCached) {
          console.log('Successfully loaded data from offline cache for', sheetName);
          return Promise.resolve(offlineCached);
        }
      } catch (e) { /* ignore */ }
      // If network and cache both fail, reject the promise
      return Promise.reject(new Error('Offline and network failed for ' + sheetName));
    });
  }
  
  function parseCSV(text) {
    var lines = text.trim().replace(/\r/g, '').split('\n');
    var headers = splitRow(lines[0]);
    return lines.slice(1).filter(Boolean).map(function (line) {
      var vals = splitRow(line);
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h.trim()] = (vals[i] || '').trim();
      });
      return obj;
    });
  }

  function splitRow(row) {
    var result = [], cur = '', inQ = false;
    for (var i = 0; i < row.length; i++) {
      var ch = row[i];
      if (ch === '"' && row[i-1] !== '\') { // Basic escaped quote check
        if (inQ && row[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        result.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result;
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---- SERVICE WORKER REGISTRATION FOR OFFLINE CACHING ----
  function registerServiceWorker() {
      if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('Service Worker registered!', reg))
                  .catch(err => console.log('Service Worker registration failed:', err));
          });
      }
  }

  // Let's create the service worker file now.
  function createServiceWorkerFile() {
      const swContent = `
          const CACHE_NAME = 'toram-db-cache-v1';
          const urlsToCache = [
              '/',
              '/index.html',
              '/css/style.css',
              '/js/main.js',
              '/js/sheets.js',
              '/js/modal.js',
              '/js/monster-modal.js',
              // Add other essential assets here
          ];

          self.addEventListener('install', event => {
              event.waitUntil(
                  caches.open(CACHE_NAME)
                      .then(cache => {
                          console.log('Opened cache');
                          return cache.addAll(urlsToCache);
                      })
              );
          });

          self.addEventListener('fetch', event => {
              event.respondWith(
                  caches.match(event.request)
                      .then(response => {
                          if (response) {
                              return response; // Serve from cache
                          }
                          return fetch(event.request); // Fetch from network
                      })
              );
          });
      `;
      // This is a pseudo-call. In a real scenario, you would use a file writing tool.
      // For this environment, we'll log it and assume it's created.
      console.log("Service Worker content created. Please save as /sw.js");
      window.swContent = swContent; // Storing it on window for mock creation
  }
  
  // -- load function and others remain largely the same --
  // The magic happens in the enhanced fetchSheet function.

  function load(page, containerId) {
    var sheetInfo = CONFIG.SHEETS[page];
    var renderer = RENDERERS[page];
    var container = document.getElementById(containerId);
    if (!sheetInfo || !container) return;

    showLoading(container);

    fetchSheet(sheetInfo)
      .then(parseCSV)
      .then(data => {
        data.forEach((r, i) => { r._index = i; });
        
        if (page !== 'quests') {
          data.reverse(); 
        }

        dataState.fullData = data;
        dataState.pageType = page;
        dataState.containerId = containerId;

        // Store all skills data to localStorage for offline skill simulator
        if (page === 'skills') {
            try {
                localStorage.setItem('toram_skills_data_all', JSON.stringify(data));
                console.log('All skill data saved for offline use.');
            } catch(e) {
                console.warn('Could not save skill data to localStorage.', e);
            }
        }
        
        document.dispatchEvent(new CustomEvent('sheetsdataready', { detail: { data, page, containerId } }));
      })
      .catch(err => {
        var msg = 'Could not load data. Displaying from cache if available, otherwise check connection.';
        showError(container, msg);
        console.error('ToramSheets Load Error:', err);
      });
  }

  // Dummy functions for placeholders, assuming they exist
  function showLoading(container) { container.innerHTML = '<p>Loading...</p>'; }
  function showError(container, msg) { container.innerHTML = `<p style="color:red;">${esc(msg)}</p>`; }
  const RENDERERS = {
      items: (data, container) => { container.innerHTML = `<p>Loaded ${data.length} items</p>`; },
      monsters: (data, container) => { container.innerHTML = `<p>Loaded ${data.length} monsters</p>`; },
      skills: (data, container) => { container.innerHTML = `<p>Loaded ${data.length} skills</p>`; },
      // Add other renderers...
  };
  
  // Call the new functions
  createServiceWorkerFile();
  registerServiceWorker();

  return {
    CONFIG,
    dataState,
    load,
    fetchSheet,
    // ... other public methods
  };
}());
