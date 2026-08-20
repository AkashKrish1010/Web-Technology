// CO3 - Experiment 5: Cross-Browser Compatible Interactive Webpage

// ─────────────────────────────────────────────────────────────
// 1. FEATURE DETECTION ENGINE
// ─────────────────────────────────────────────────────────────

// Check localStorage support with try/catch (handles Safari Private mode & security restrictions)
function isLocalStorageSupported() {
  try {
    const testKey = '__test_feature_key__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Check querySelector support
function isQuerySelectorSupported() {
  return typeof document.querySelector === 'function';
}

// Check CSS @supports in JS (CSS.supports API)
function isCssSupportsSupported() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function';
}

// Check Fetch API
function isFetchSupported() {
  return typeof window.fetch === 'function';
}

// Render Feature Detection Matrix
const featureMatrixEl = document.getElementById('featureMatrix');
const features = [
  { name: 'localStorage API', supported: isLocalStorageSupported(), icon: '💾', fallback: 'In-Memory RAM Store' },
  { name: 'document.querySelector', supported: isQuerySelectorSupported(), icon: '🎯', fallback: 'getElementById / Tag Polyfill' },
  { name: 'CSS.supports API', supported: isCssSupportsSupported(), icon: '🎨', fallback: 'Standard CSS Cascade' },
  { name: 'Fetch API', supported: isFetchSupported(), icon: '📡', fallback: 'XMLHttpRequest Polyfill' }
];

featureMatrixEl.innerHTML = features.map(f => `
  <div class="feature-card">
    <div class="feature-icon">${f.icon}</div>
    <div>
      <div class="feature-name">${f.name}</div>
      <div class="feature-status ${f.supported ? 'status-supported' : 'status-fallback'}">
        ${f.supported ? '✅ Native Support' : `⚠️ Fallback: ${f.fallback}`}
      </div>
    </div>
  </div>
`).join('');

// ─────────────────────────────────────────────────────────────
// 2. CROSS-BROWSER SAFE STORAGE PROVIDER
// ─────────────────────────────────────────────────────────────

// In-Memory Storage Fallback Implementation
class MemoryStorageFallback {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const memoryStore = new MemoryStorageFallback();
let simulateDisabledStorage = false;

// Universal Storage Facade (Pattern: Graceful Fallback)
function getStorageProvider() {
  if (!simulateDisabledStorage && isLocalStorageSupported()) {
    return { provider: window.localStorage, name: 'Native localStorage' };
  }
  return { provider: memoryStore, name: 'MemoryStorageFallback (In-Memory)' };
}

const noteInput = document.getElementById('noteInput');
const activeProviderEl = document.getElementById('activeProvider');
const storageFeedback = document.getElementById('storageFeedback');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const clearNoteBtn = document.getElementById('clearNoteBtn');
const toggleStorageMockBtn = document.getElementById('toggleStorageMockBtn');

const NOTE_KEY = 'co3_student_note';

function updateStorageUI() {
  const { provider, name } = getStorageProvider();
  activeProviderEl.textContent = name;
  noteInput.value = provider.getItem(NOTE_KEY) || '';
}

saveNoteBtn.addEventListener('click', () => {
  const { provider, name } = getStorageProvider();
  const text = noteInput.value.trim();
  provider.setItem(NOTE_KEY, text);
  showFeedback(`Saved note to [${name}]!`);
});

clearNoteBtn.addEventListener('click', () => {
  const { provider, name } = getStorageProvider();
  provider.removeItem(NOTE_KEY);
  noteInput.value = '';
  showFeedback(`Cleared note from [${name}].`);
});

toggleStorageMockBtn.addEventListener('click', () => {
  simulateDisabledStorage = !simulateDisabledStorage;
  toggleStorageMockBtn.textContent = simulateDisabledStorage
    ? '🧪 Restore Native Storage'
    : '🧪 Simulate Disabled Storage';
  updateStorageUI();
  showFeedback(simulateDisabledStorage ? 'Simulating localStorage failure -> routed to Memory fallback!' : 'Restored native storage provider.');
});

function showFeedback(msg) {
  storageFeedback.textContent = msg;
  storageFeedback.className = 'feedback-msg success';
  setTimeout(() => {
    storageFeedback.textContent = '';
    storageFeedback.className = 'feedback-msg';
  }, 3500);
}

// ─────────────────────────────────────────────────────────────
// 3. CROSS-BROWSER ELEMENT SELECTOR ENGINE WITH FALLBACK
// ─────────────────────────────────────────────────────────────

const selectorLog = document.getElementById('selectorLog');

function safeQuery(selector) {
  // If querySelector is available, use it directly
  if (isQuerySelectorSupported()) {
    const el = document.querySelector(selector);
    return { element: el, engine: 'document.querySelector()' };
  }

  // Fallback 1: ID selector (#itemAlpha)
  if (selector.startsWith('#')) {
    const id = selector.substring(1);
    const el = document.getElementById(id);
    return { element: el, engine: 'document.getElementById() [FALLBACK]' };
  }

  // Fallback 2: Class selector (.target-beta)
  if (selector.startsWith('.')) {
    const className = selector.substring(1);
    if (document.getElementsByClassName) {
      const el = document.getElementsByClassName(className)[0];
      return { element: el, engine: 'document.getElementsByClassName() [FALLBACK]' };
    }
    // Deep fallback: traverse all tags
    const all = document.getElementsByTagName('*');
    for (let i = 0; i < all.length; i++) {
      if (all[i].className && all[i].className.indexOf(className) !== -1) {
        return { element: all[i], engine: 'document.getElementsByTagName(*) [DEEP FALLBACK]' };
      }
    }
  }

  return { element: null, engine: 'Unsupported selector' };
}

function clearHighlights() {
  const items = document.querySelectorAll('.demo-item');
  items.forEach(it => it.classList.remove('highlighted'));
}

document.getElementById('queryNativeBtn').addEventListener('click', () => {
  clearHighlights();
  const res = safeQuery('#itemAlpha');
  if (res.element) {
    res.element.classList.add('highlighted');
    selectorLog.textContent = `Target: #itemAlpha\nEngine Used: ${res.engine}\nMatched Node: <${res.element.tagName.toLowerCase()} id="${res.element.id}">`;
  }
});

document.getElementById('queryFallbackClassBtn').addEventListener('click', () => {
  clearHighlights();
  const res = safeQuery('.target-beta');
  if (res.element) {
    res.element.classList.add('highlighted');
    selectorLog.textContent = `Target: .target-beta\nEngine Used: ${res.engine}\nMatched Node: <${res.element.tagName.toLowerCase()} class="${res.element.className}">`;
  }
});

document.getElementById('highlightAllBtn').addEventListener('click', () => {
  clearHighlights();
  const items = document.querySelectorAll('.demo-item');
  items.forEach(it => it.classList.add('highlighted'));
  selectorLog.textContent = `Batch Highlight: ${items.length} nodes highlighted safely across all browser versions.`;
});

// Initial boot
updateStorageUI();
