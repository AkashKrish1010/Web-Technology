// CO3 - Experiment 4: Browser Information Dashboard Using Window Object

let resizeEventCount = 0;

// 1. DOM Elements
const onlineStatusEl = document.getElementById('onlineStatus');
const viewportDimEl = document.getElementById('viewportDimensions');
const screenDimEl = document.getElementById('screenDimensions');
const scrollPosEl = document.getElementById('scrollPosition');

const locHref = document.getElementById('locHref');
const locProtocol = document.getElementById('locProtocol');
const locHost = document.getElementById('locHost');
const locPathname = document.getElementById('locPathname');
const locOrigin = document.getElementById('locOrigin');

const navLang = document.getElementById('navLang');
const navUserAgent = document.getElementById('navUserAgent');
const navCookie = document.getElementById('navCookie');
const screenDepth = document.getElementById('screenDepth');
const screenAvail = document.getElementById('screenAvail');

const liveW = document.getElementById('liveW');
const liveH = document.getElementById('liveH');
const widthProgress = document.getElementById('widthProgress');
const aspectRatioVal = document.getElementById('aspectRatioVal');
const resizeCountEl = document.getElementById('resizeCount');

// 2. Populate Static / Semi-Static Window & Navigator Properties
function updateStaticData() {
  // window.location
  locHref.textContent = window.location.href;
  locProtocol.textContent = window.location.protocol || '(file:)';
  locHost.textContent = window.location.host || '(local filesystem)';
  locPathname.textContent = window.location.pathname;
  locOrigin.textContent = window.location.origin || '(null/local)';

  // navigator
  navLang.textContent = `${navigator.language} (${(navigator.languages || []).join(', ')})`;
  navUserAgent.textContent = navigator.userAgent;
  navCookie.textContent = navigator.cookieEnabled ? 'Enabled ✅' : 'Disabled ❌';

  // screen
  screenDepth.textContent = `${screen.colorDepth}-bit (${Math.pow(2, screen.colorDepth).toLocaleString()} colors)`;
  screenAvail.textContent = `${screen.availWidth} × ${screen.availHeight} px`;
  screenDimEl.textContent = `${screen.width} × ${screen.height} px`;
}

// 3. Update Network Online / Offline Status (navigator.onLine)
function updateNetworkStatus() {
  if (navigator.onLine) {
    onlineStatusEl.textContent = 'ONLINE (Connected 🟢)';
    onlineStatusEl.className = 'metric-value status-online';
  } else {
    onlineStatusEl.textContent = 'OFFLINE (Disconnected 🔴)';
    onlineStatusEl.className = 'metric-value status-offline';
  }
}

// 4. Update Viewport Dimensions & Resize Trigger (window.innerWidth / innerHeight & resize event)
function updateViewportMetrics() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  viewportDimEl.textContent = `${w} × ${h} px`;
  liveW.textContent = w;
  liveH.textContent = h;

  // Aspect ratio calculation
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h);
  aspectRatioVal.textContent = `${Math.round((w / divisor) * 10) / 10} : ${Math.round((h / divisor) * 10) / 10} (Ratio: ${(w / h).toFixed(2)})`;

  // Visual width bar (relative to max 2560px screen)
  const percent = Math.min(100, Math.max(10, (w / 1920) * 100));
  widthProgress.style.width = `${percent}%`;
}

// 5. Update Scroll Position (window.scrollX, window.scrollY)
function updateScrollMetrics() {
  const x = Math.round(window.scrollX || window.pageXOffset || 0);
  const y = Math.round(window.scrollY || window.pageYOffset || 0);
  scrollPosEl.textContent = `X: ${x}px | Y: ${y}px`;
}

// ─────────────────────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────────────────────

// Resize event
window.addEventListener('resize', () => {
  resizeEventCount++;
  resizeCountEl.textContent = resizeEventCount;
  updateViewportMetrics();
});

// Scroll event
window.addEventListener('scroll', () => {
  updateScrollMetrics();
});

// Online & Offline events
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Navigation action buttons
document.getElementById('reloadBtn').addEventListener('click', () => {
  window.location.reload();
});

document.getElementById('hashBtn').addEventListener('click', () => {
  window.location.hash = 'dashboard-' + Math.floor(Math.random() * 1000);
  updateStaticData();
});

document.getElementById('scrollToTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('scrollToBottomBtn').addEventListener('click', () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// Initial boot
updateStaticData();
updateNetworkStatus();
updateViewportMetrics();
updateScrollMetrics();
