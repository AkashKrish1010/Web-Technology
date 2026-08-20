// CO3 – EXP_1 | DOM-Based Interactive Student Registration Preview
// Uses: getElementById(), querySelector(), createElement(), textContent,
//       addEventListener(), classList, element removal

// ── DOM References ──────────────────────────────────────────────────────────
const displayBtn      = document.getElementById('displayBtn');
const removeBtn       = document.getElementById('removeBtn');
const validationMsg   = document.getElementById('validationMsg');
const profileCard     = document.getElementById('profileCard');
const profilePlaceholder = document.getElementById('profilePlaceholder');

// Form inputs
const studentNameInput = document.getElementById('studentName');
const regNumberInput   = document.getElementById('regNumber');
const departmentInput  = document.getElementById('department');
const yearOfStudyInput = document.getElementById('yearOfStudy');

// Profile output elements
const profileName      = document.getElementById('profileName');
const profileAvatar    = document.getElementById('profileAvatar');
const profileDept      = document.getElementById('profileDept');
const profileRegNo     = document.getElementById('profileRegNo');
const profileDeptDetail= document.getElementById('profileDeptDetail');
const profileYear      = document.getElementById('profileYear');
const generatedTime    = document.getElementById('generatedTime');

// ── Helper: Show Validation Message ─────────────────────────────────────────
function showMessage(msg, type = 'error') {
  validationMsg.textContent = msg;
  validationMsg.className = 'validation-msg ' + type;

  // Auto-clear after 4 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      validationMsg.textContent = '';
      validationMsg.className = 'validation-msg';
    }, 4000);
  }
}

// ── Helper: Validate Inputs ──────────────────────────────────────────────────
function validateInputs(name, regNo, dept, year) {
  if (!name.trim()) {
    showMessage('⚠️ Please enter the student\'s full name.');
    studentNameInput.focus();
    return false;
  }
  if (!regNo.trim()) {
    showMessage('⚠️ Please enter the register number.');
    regNumberInput.focus();
    return false;
  }
  if (!dept) {
    showMessage('⚠️ Please select a department.');
    departmentInput.focus();
    return false;
  }
  if (!year) {
    showMessage('⚠️ Please select the year of study.');
    yearOfStudyInput.focus();
    return false;
  }
  return true;
}

// ── Display Profile ──────────────────────────────────────────────────────────
function displayProfile() {
  // Read values using getElementById / querySelector
  const name   = document.getElementById('studentName').value;
  const regNo  = document.getElementById('regNumber').value;
  const dept   = document.querySelector('#department').value;
  const year   = document.querySelector('#yearOfStudy').value;

  // Validate
  if (!validateInputs(name, regNo, dept, year)) return;

  // Populate profile card using textContent
  profileName.textContent       = name.trim();
  profileAvatar.textContent     = name.trim().charAt(0).toUpperCase();
  profileDept.textContent       = dept;
  profileRegNo.textContent      = regNo.trim().toUpperCase();
  profileDeptDetail.textContent = dept;
  profileYear.textContent       = year;

  // Dynamic timestamp using createElement
  const now = new Date();
  const timeStr = now.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
  generatedTime.textContent = 'Generated: ' + timeStr;

  // Show profile card, hide placeholder using classList / style
  profilePlaceholder.style.display = 'none';
  profileCard.style.display        = 'block';

  // Show remove button
  removeBtn.style.display = 'inline-flex';

  // Success message
  showMessage('✅ Profile displayed successfully!', 'success');
}

// ── Remove Profile ───────────────────────────────────────────────────────────
function removeProfile() {
  // Hide the profile card
  profileCard.style.display = 'none';

  // Show placeholder again
  profilePlaceholder.style.display = 'block';

  // Hide remove button
  removeBtn.style.display = 'none';

  // Clear form
  studentNameInput.value  = '';
  regNumberInput.value    = '';
  departmentInput.value   = '';
  yearOfStudyInput.value  = '';

  // Clear message
  validationMsg.textContent = '';
  validationMsg.className   = 'validation-msg';
}

// ── Event Listeners (addEventListener) ──────────────────────────────────────
displayBtn.addEventListener('click', displayProfile);
removeBtn.addEventListener('click', removeProfile);

// Allow pressing Enter in text inputs to trigger display
studentNameInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') displayProfile();
});

regNumberInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') displayProfile();
});

// Clear error message when user starts typing
[studentNameInput, regNumberInput, departmentInput, yearOfStudyInput].forEach(function (el) {
  el.addEventListener('input', function () {
    if (validationMsg.classList.contains('error')) {
      validationMsg.textContent = '';
      validationMsg.className   = 'validation-msg';
    }
  });
});
