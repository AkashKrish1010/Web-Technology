// ===== DOM References =====
const form = document.getElementById('registrationForm');
const successCard = document.getElementById('successCard');

// ===== Utility: show/hide error =====
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
}
function clearError(id) { document.getElementById(id).textContent = ''; }

// ===== Regular Expressions =====
const REGEX = {
  name:     /^[A-Za-z\s]{2,30}$/,
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone:    /^[6-9]\d{9}$/,
  rollNo:   /^[A-Z0-9]{4,12}$/i,
  password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
};

// ===== Field Validators =====
function validateField(id, regex, errId, label) {
  const val = document.getElementById(id).value.trim();
  const input = document.getElementById(id);
  if (!val) { showError(errId, `${label} is required.`); input.className = 'invalid'; return false; }
  if (regex && !regex.test(val)) { showError(errId, `Enter a valid ${label.toLowerCase()}.`); input.className = 'invalid'; return false; }
  clearError(errId);
  input.className = 'valid';
  return true;
}

// ===== Password Strength =====
const pwdInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');

pwdInput.addEventListener('input', () => {
  const val = pwdInput.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'hsl(0,75%,55%)', 'hsl(35,90%,52%)', 'hsl(48,100%,50%)', 'hsl(150,70%,45%)'];
  const widths = ['0%', '25%', '50%', '75%', '100%'];

  strengthBar.style.width = widths[score] || '0%';
  strengthBar.style.background = colors[score] || '';
  strengthLabel.textContent = score ? levels[score] : '';
  strengthLabel.style.color = colors[score] || '';
});

// ===== Toggle Password Visibility =====
document.getElementById('togglePwd').addEventListener('click', function () {
  const type = pwdInput.type === 'password' ? 'text' : 'password';
  pwdInput.type = type;
  this.textContent = type === 'password' ? '👁️' : '🙈';
});

// ===== Real-time Validation =====
['firstName','lastName','email','phone','rollNo','password'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => {
    const map = {
      firstName: [REGEX.name, 'firstNameErr', 'First Name'],
      lastName:  [REGEX.name, 'lastNameErr',  'Last Name'],
      email:     [REGEX.email,'emailErr',      'Email'],
      phone:     [REGEX.phone,'phoneErr',      'Phone Number'],
      rollNo:    [REGEX.rollNo,'rollNoErr',    'Roll Number'],
      password:  [REGEX.password,'passwordErr','Password'],
    };
    const [regex, errId, label] = map[id];
    validateField(id, regex, errId, label);
  });
});

// ===== Form Submit Handler =====
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let isValid = true;

  // Personal
  if (!validateField('firstName', REGEX.name, 'firstNameErr', 'First Name')) isValid = false;
  if (!validateField('lastName',  REGEX.name, 'lastNameErr',  'Last Name'))  isValid = false;

  // DOB
  const dob = document.getElementById('dob').value;
  if (!dob) { showError('dobErr', 'Date of birth is required.'); isValid = false; }
  else {
    const age = Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 3600 * 1000));
    if (age < 15 || age > 35) { showError('dobErr', 'Age must be between 15–35 years.'); isValid = false; }
    else clearError('dobErr');
  }

  // Gender
  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) { showError('genderErr', 'Please select a gender.'); isValid = false; }
  else clearError('genderErr');

  // Contact
  if (!validateField('email', REGEX.email, 'emailErr', 'Email'))       isValid = false;
  if (!validateField('phone', REGEX.phone, 'phoneErr', 'Phone Number')) isValid = false;

  // Academic
  if (!validateField('rollNo', REGEX.rollNo, 'rollNoErr', 'Roll Number')) isValid = false;
  const dept = document.getElementById('department').value;
  if (!dept) { showError('departmentErr', 'Please select a department.'); isValid = false; }
  else clearError('departmentErr');
  const yr = document.getElementById('year').value;
  if (!yr) { showError('yearErr', 'Please select a year.'); isValid = false; }
  else clearError('yearErr');

  // Password
  if (!validateField('password', REGEX.password, 'passwordErr', 'Password')) isValid = false;
  const pwd  = document.getElementById('password').value;
  const cpwd = document.getElementById('confirmPassword').value;
  if (!cpwd) { showError('confirmPasswordErr', 'Please confirm your password.'); isValid = false; }
  else if (pwd !== cpwd) { showError('confirmPasswordErr', 'Passwords do not match.'); isValid = false; }
  else clearError('confirmPasswordErr');

  // Terms
  const terms = document.getElementById('terms').checked;
  if (!terms) { showError('termsErr', 'You must agree to the terms.'); isValid = false; }
  else clearError('termsErr');

  if (isValid) {
    const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
    document.getElementById('successMsg').textContent =
      `Welcome, ${name}! Your student account has been created successfully.`;
    form.style.display = 'none';
    successCard.style.display = 'block';
  }
});

// ===== Reset =====
function resetForm() {
  form.reset();
  form.style.display = 'block';
  successCard.style.display = 'none';
  document.querySelectorAll('input').forEach(i => i.className = '');
  strengthBar.style.width = '0';
  strengthLabel.textContent = '';
}
