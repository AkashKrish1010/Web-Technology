// CO3 - Experiment 8: Online Student Result Processing Using Servlet

const simulateResultBtn = document.getElementById('simulateResultBtn');
const simResultWrapper = document.getElementById('simResultWrapper');
const closeResultBtn = document.getElementById('closeResultBtn');

const resStudent = document.getElementById('resStudent');
const resMeta = document.getElementById('resMeta');
const resStatusBadge = document.getElementById('resStatusBadge');
const resTotal = document.getElementById('resTotal');
const resAvg = document.getElementById('resAvg');
const resHigh = document.getElementById('resHigh');
const resGrade = document.getElementById('resGrade');
const resTableBody = document.getElementById('resTableBody');

const subjects = [
  'Web Technology',
  'Database Management Systems',
  'Data Structures & Algorithms',
  'Operating Systems',
  'Computer Networks'
];

simulateResultBtn.addEventListener('click', () => {
  const name = document.getElementById('studentName').value.trim();
  const regNo = document.getElementById('regNumber').value.trim();
  const dept = document.getElementById('department').value.trim();

  const marks = [
    parseInt(document.getElementById('mark1').value, 10),
    parseInt(document.getElementById('mark2').value, 10),
    parseInt(document.getElementById('mark3').value, 10),
    parseInt(document.getElementById('mark4').value, 10),
    parseInt(document.getElementById('mark5').value, 10)
  ];

  // Validation
  for (let i = 0; i < marks.length; i++) {
    if (isNaN(marks[i]) || marks[i] < 0 || marks[i] > 100) {
      alert(`⚠️ Mark for ${subjects[i]} must be a valid number between 0 and 100.`);
      return;
    }
  }

  // Calculations
  let total = 0;
  let highest = marks[0];
  let lowest = marks[0];
  let allPass = true;

  marks.forEach(m => {
    total += m;
    if (m > highest) highest = m;
    if (m < lowest) lowest = m;
    if (m < 50) allPass = false;
  });

  const avg = total / 5.0;
  let grade = 'RA';
  if (avg >= 90) grade = 'O';
  else if (avg >= 80) grade = 'A+';
  else if (avg >= 70) grade = 'A';
  else if (avg >= 60) grade = 'B+';
  else if (avg >= 50) grade = 'B';

  // Render
  resStudent.textContent = name || 'Student';
  resMeta.textContent = `REG: ${(regNo || 'N/A').toUpperCase()} | ${dept}`;
  resTotal.textContent = `${total} / 500`;
  resAvg.textContent = `${avg.toFixed(2)}%`;
  resHigh.textContent = `${highest} (Lowest: ${lowest})`;
  resGrade.textContent = grade;

  resStatusBadge.textContent = allPass ? 'PASS' : 'FAIL';
  resStatusBadge.className = 'status-pill ' + (allPass ? 'pass' : 'fail');

  resTableBody.innerHTML = subjects.map((sub, idx) => {
    const scored = marks[idx];
    const passed = scored >= 50;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${sub}</strong></td>
        <td style="font-weight:700; color:${passed ? '#38bdf8' : '#f87171'};">${scored}</td>
        <td>100</td>
        <td><span class="status-pill ${passed ? 'pass' : 'fail'}" style="padding:2px 10px; font-size:0.75rem;">${passed ? 'PASS' : 'FAIL'}</span></td>
      </tr>
    `;
  }).join('');

  simResultWrapper.style.display = 'block';
  simResultWrapper.scrollIntoView({ behavior: 'smooth' });
});

closeResultBtn.addEventListener('click', () => {
  simResultWrapper.style.display = 'none';
});
