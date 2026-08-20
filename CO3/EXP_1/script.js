// CO3 - Experiment 1: DOM-Based Student Profile Manipulation

// DOM element selections
const headingInput = document.getElementById('headingInput');
const updateHeadingBtn = document.getElementById('updateHeadingBtn');
const textColorPicker = document.getElementById('textColorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const toggleBorderBtn = document.getElementById('toggleBorderBtn');
const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');
const updateBadgeBtn = document.getElementById('updateBadgeBtn');
const resetBtn = document.getElementById('resetBtn');
const domLog = document.getElementById('domLog');

// Target elements
const profileCard = document.querySelector('#studentProfileCard');
const profileHeading = document.getElementById('profileHeading');
const statusBadge = document.querySelector('#statusBadge');
const hiddenNotice = document.getElementById('hiddenNotice');

// Log helper function
function logAction(codeSnippet) {
  domLog.textContent = codeSnippet;
}

// 1. textContent modification
updateHeadingBtn.addEventListener('click', () => {
  const newHeading = headingInput.value.trim();
  if (newHeading) {
    profileHeading.textContent = newHeading;
    logAction(`document.getElementById('profileHeading').textContent = "${newHeading}";`);
  }
});

// 2. style.color modification
textColorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  profileCard.style.color = color;
  // Also adjust heading and text elements inside
  document.querySelector('#studentName').style.color = color;
  logAction(`document.querySelector('#studentProfileCard').style.color = "${color}";`);
});

// 3. style.backgroundColor modification
bgColorPicker.addEventListener('input', (e) => {
  const bgColor = e.target.value;
  profileCard.style.backgroundColor = bgColor;
  logAction(`document.querySelector('#studentProfileCard').style.backgroundColor = "${bgColor}";`);
});

// 4. classList manipulation (Toggle Theme)
toggleThemeBtn.addEventListener('click', () => {
  profileCard.classList.toggle('dark-mode');
  const hasDark = profileCard.classList.contains('dark-mode');
  logAction(`profileCard.classList.toggle('dark-mode'); // Active: ${hasDark}`);
});

// 5. classList manipulation (Toggle Border)
toggleBorderBtn.addEventListener('click', () => {
  profileCard.classList.toggle('special-border');
  const hasBorder = profileCard.classList.contains('special-border');
  logAction(`profileCard.classList.toggle('special-border'); // Active: ${hasBorder}`);
});

// 6. style.display (Show/Hide)
toggleVisibilityBtn.addEventListener('click', () => {
  if (profileCard.style.display === 'none') {
    profileCard.style.display = 'block';
    hiddenNotice.style.display = 'none';
    logAction(`profileCard.style.display = 'block';`);
  } else {
    profileCard.style.display = 'none';
    hiddenNotice.style.display = 'block';
    logAction(`profileCard.style.display = 'none';`);
  }
});

// 7. setAttribute() modification
let badgeIndex = 0;
const badges = [
  { text: 'Gold Medalist', status: 'gold', category: 'merit' },
  { text: 'Honors Scholar', status: 'honors', category: 'distinction' },
  { text: 'Verified Student', status: 'verified', category: 'undergraduate' }
];

updateBadgeBtn.addEventListener('click', () => {
  badgeIndex = (badgeIndex + 1) % badges.length;
  const current = badges[badgeIndex];
  
  statusBadge.textContent = current.text;
  statusBadge.setAttribute('data-status', current.status);
  statusBadge.setAttribute('data-category', current.category);
  profileCard.setAttribute('data-status', current.status);

  logAction(`statusBadge.setAttribute('data-status', '${current.status}');\nstatusBadge.setAttribute('data-category', '${current.category}');`);
});

// 8. Reset All
resetBtn.addEventListener('click', () => {
  profileCard.style.display = 'block';
  hiddenNotice.style.display = 'none';
  profileCard.style.color = '';
  profileCard.style.backgroundColor = '';
  document.querySelector('#studentName').style.color = '';
  profileCard.classList.remove('dark-mode', 'special-border');
  profileHeading.textContent = 'Department of Computer Science';
  headingInput.value = 'Department of Computer Science';
  textColorPicker.value = '#0f172a';
  bgColorPicker.value = '#ffffff';
  statusBadge.textContent = 'Verified Student';
  statusBadge.setAttribute('data-status', 'verified');
  statusBadge.setAttribute('data-category', 'undergraduate');
  profileCard.setAttribute('data-status', 'verified');
  logAction(`// Reset all DOM styles, classes, and attributes to default`);
});
