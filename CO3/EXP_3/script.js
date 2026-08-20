// CO3 - Experiment 3: Interactive Event Registration Using JavaScript Events

let intrinsicCount = 0;
let modernCount = 0;

const intrinsicCountEl = document.getElementById('intrinsicCount');
const modernCountEl = document.getElementById('modernCount');
const totalEventsCountEl = document.getElementById('totalEventsCount');
const eventStream = document.getElementById('eventStream');
const clearLogBtn = document.getElementById('clearLogBtn');

// Helper to log event to the UI stream
function logEvent(eventName, handlerType, targetName, details = '') {
  if (handlerType === 'intrinsic') {
    intrinsicCount++;
    intrinsicCountEl.textContent = intrinsicCount;
  } else {
    modernCount++;
    modernCountEl.textContent = modernCount;
  }
  totalEventsCountEl.textContent = intrinsicCount + modernCount;

  // Remove placeholder if present
  const placeholder = eventStream.querySelector('.stream-placeholder');
  if (placeholder) placeholder.remove();

  const time = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'event-entry';
  entry.innerHTML = `
    <span class="event-time">${time}</span>
    <span class="event-type-badge ${handlerType}">${handlerType}</span>
    <span class="event-name">${eventName}</span>
    <span class="event-target">&rarr; &lt;${targetName}&gt; ${details}</span>
  `;

  eventStream.insertBefore(entry, eventStream.firstChild);

  // Keep max 25 entries in view
  if (eventStream.children.length > 25) {
    eventStream.removeChild(eventStream.lastChild);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. INTRINSIC EVENT HANDLERS (Called via inline HTML attributes)
// ─────────────────────────────────────────────────────────────

function handleIntrinsicClick(e) {
  logEvent('onclick', 'intrinsic', 'button', 'Clicked Intrinsic Button');
}

function handleIntrinsicChange(val) {
  logEvent('onchange', 'intrinsic', 'select', `Value: "${val}"`);
}

function handleIntrinsicMouseOver(element) {
  element.classList.add('active-hover');
  document.getElementById('hoverText').textContent = '🌟 VIP Access: Priority Seating + Swag Kit unlocked!';
  logEvent('onmouseover', 'intrinsic', 'div#hoverZone', 'Hover Active');
}

function handleIntrinsicMouseOut(element) {
  element.classList.remove('active-hover');
  document.getElementById('hoverText').textContent = '✨ Hover over this box to explore VIP perks!';
  logEvent('onmouseout', 'intrinsic', 'div#hoverZone', 'Hover Left');
}

// ─────────────────────────────────────────────────────────────
// 2. MODERN EVENT HANDLING (Using addEventListener)
// ─────────────────────────────────────────────────────────────

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailInput');
const eventTrackSelect = document.getElementById('eventTrack');
const termsCheckbox = document.getElementById('termsCheck');
const eventRegForm = document.getElementById('eventRegForm');
const nameHint = document.getElementById('nameHint');
const emailHint = document.getElementById('emailHint');

// 'focus' event
fullNameInput.addEventListener('focus', () => {
  nameHint.style.color = '#2563eb';
  nameHint.textContent = 'Active: Typing full name... (focus triggered)';
  logEvent('focus', 'modern', 'input#fullName', 'Focused');
});

// 'blur' event
fullNameInput.addEventListener('blur', () => {
  nameHint.style.color = '#8b5cf6';
  nameHint.textContent = 'Trigger: focus / blur / input';
  logEvent('blur', 'modern', 'input#fullName', 'Lost Focus');
});

// 'input' event (real-time typing)
fullNameInput.addEventListener('input', (e) => {
  logEvent('input', 'modern', 'input#fullName', `Chars: ${e.target.value.length}`);
});

// 'input' on email
emailInput.addEventListener('input', (e) => {
  logEvent('input', 'modern', 'input#emailInput', `Input: "${e.target.value}"`);
});

// 'change' on email (fires when field value commits on blur)
emailInput.addEventListener('change', (e) => {
  logEvent('change', 'modern', 'input#emailInput', `Committed: "${e.target.value}"`);
});

// 'change' on select (demonstrating modern listener attached to same element having intrinsic onchange)
eventTrackSelect.addEventListener('change', (e) => {
  logEvent('change', 'modern', 'select#eventTrack', `Selected: "${e.target.value}"`);
});

// 'change' on checkbox
termsCheckbox.addEventListener('change', (e) => {
  logEvent('change', 'modern', 'input#termsCheck', `Checked: ${e.target.checked}`);
});

// 'submit' event on form
eventRegForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default page reload
  logEvent('submit', 'modern', 'form#eventRegForm', 'Form Validation Passed & Submission Handled');

  alert(`🎉 Registration Successful!\n\nName: ${fullNameInput.value}\nEmail: ${emailInput.value}\nTrack: ${eventTrackSelect.value}`);
  
  eventRegForm.reset();
  document.getElementById('hoverText').textContent = '✨ Hover over this box to explore VIP perks!';
});

// Clear log button
clearLogBtn.addEventListener('click', () => {
  eventStream.innerHTML = '<div class="stream-placeholder">Log cleared. Interact with controls to record new events...</div>';
  intrinsicCount = 0;
  modernCount = 0;
  intrinsicCountEl.textContent = '0';
  modernCountEl.textContent = '0';
  totalEventsCountEl.textContent = '0';
});
