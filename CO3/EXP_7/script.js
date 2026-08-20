// CO3 - Experiment 7: Student Registration Form Processing Using Servlet

const regForm = document.getElementById('regForm');
const simulatePostBtn = document.getElementById('simulatePostBtn');
const simResultContainer = document.getElementById('simResultContainer');
const closeSimBtn = document.getElementById('closeSimBtn');

const resName = document.getElementById('resName');
const resReg = document.getElementById('resReg');
const resEmail = document.getElementById('resEmail');
const resDept = document.getElementById('resDept');
const resSem = document.getElementById('resSem');

simulatePostBtn.addEventListener('click', () => {
  const name = document.getElementById('studentName').value.trim();
  const regNo = document.getElementById('regNumber').value.trim();
  const email = document.getElementById('email').value.trim();
  const dept = document.getElementById('department').value;
  const sem = document.getElementById('semester').value;

  if (!name || !regNo || !email || !dept || !sem) {
    alert('⚠️ Please fill out all required fields before simulating!');
    return;
  }

  resName.textContent = name;
  resReg.textContent = regNo.toUpperCase();
  resEmail.textContent = email;
  resDept.textContent = dept;
  resSem.textContent = sem;

  simResultContainer.style.display = 'block';
  simResultContainer.scrollIntoView({ behavior: 'smooth' });
});

closeSimBtn.addEventListener('click', () => {
  simResultContainer.style.display = 'none';
});
