// ===== Real-time Clock =====
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, '0');

  document.getElementById('clockTime').textContent = `${formattedHours}:${minutes}:${seconds}`;
  document.getElementById('clockAmpm').textContent = ampm;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('clockDate').textContent = now.toLocaleDateString('en-US', options);

  const timezoneOffset = -now.getTimezoneOffset();
  const diffHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const diffMins = Math.abs(timezoneOffset) % 60;
  const sign = timezoneOffset >= 0 ? '+' : '-';
  const tzString = `GMT${sign}${String(diffHours).padStart(2, '0')}${String(diffMins).padStart(2, '0')} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
  document.getElementById('clockTimezone').textContent = tzString;
}

setInterval(updateClock, 1000);
updateClock();

// ===== Countdown Timer =====
let targetDate = new Date('2026-11-25T09:30:00');
let examName = 'Web Technology End-Sem';

function handleExamChange() {
  const select = document.getElementById('examSelect');
  const customGroup = document.getElementById('customDateGroup');
  if (select.value === 'custom') {
    customGroup.style.display = 'flex';
  } else {
    customGroup.style.display = 'none';
  }
}

function updateCountdownTarget() {
  const select = document.getElementById('examSelect');
  if (select.value === 'web-tech') {
    targetDate = new Date('2026-11-25T09:30:00');
    examName = 'Web Technology End-Sem';
  } else if (select.value === 'dsa') {
    targetDate = new Date('2026-12-02T09:30:00');
    examName = 'Data Structures & Algorithms';
  } else if (select.value === 'dbms') {
    targetDate = new Date('2026-12-08T09:30:00');
    examName = 'Database Systems';
  } else if (select.value === 'custom') {
    const customVal = document.getElementById('customExamDate').value;
    if (!customVal) {
      alert('Please select a valid custom date and time.');
      return;
    }
    targetDate = new Date(customVal);
    examName = 'Custom Examination';
  }

  document.getElementById('statusMsg').textContent = `Countdown active for ${examName}`;
  runCountdown();
}

function runCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    document.getElementById('statusMsg').textContent = `🎉 Examination time for ${examName} has arrived!`;
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

setInterval(runCountdown, 1000);
handleExamChange();
runCountdown();
