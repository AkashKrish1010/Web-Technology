// ===== Subject Data =====
const subjects = [
  { name: 'Mathematics',        max: 100 },
  { name: 'Physics',            max: 100 },
  { name: 'Chemistry',          max: 100 },
  { name: 'Computer Science',   max: 100 },
  { name: 'English',            max: 100 },
  { name: 'Data Structures',    max: 100 },
];

// ===== Build Input Cards =====
function buildInputs() {
  const container = document.getElementById('subjectInputs');
  container.innerHTML = '';
  subjects.forEach((sub, i) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <label for="marks_${i}">${sub.name}</label>
      <div class="inputs">
        <input type="number" id="marks_${i}" min="0" max="${sub.max}"
               placeholder="Enter marks" data-index="${i}" />
        <span class="max-label">/ ${sub.max}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// ===== Grading Function =====
function getGrade(pct) {
  if (pct >= 90) return { grade: 'O',  cls: 'grade-O', gpa: 10 };
  if (pct >= 80) return { grade: 'A+', cls: 'grade-A', gpa: 9  };
  if (pct >= 70) return { grade: 'A',  cls: 'grade-A', gpa: 8  };
  if (pct >= 60) return { grade: 'B+', cls: 'grade-B', gpa: 7  };
  if (pct >= 50) return { grade: 'B',  cls: 'grade-B', gpa: 6  };
  if (pct >= 40) return { grade: 'C',  cls: 'grade-C', gpa: 5  };
  return                 { grade: 'F',  cls: 'grade-F', gpa: 0  };
}

// ===== Analyse =====
function analyzeResults() {
  const marks = [];
  let hasError = false;

  subjects.forEach((sub, i) => {
    const input = document.getElementById(`marks_${i}`);
    const val = parseFloat(input.value);
    if (isNaN(val) || val < 0 || val > sub.max) {
      input.style.borderColor = 'hsl(0,75%,55%)';
      hasError = true;
    } else {
      input.style.borderColor = '';
      marks.push({ ...sub, obtained: val });
    }
  });

  if (hasError || marks.length !== subjects.length) {
    alert('Please enter valid marks for all subjects.');
    return;
  }

  // ===== Build result rows =====
  const tbody = document.getElementById('resultBody');
  tbody.innerHTML = '';

  const allMarks     = marks.map(m => m.obtained);
  const maxMark      = Math.max(...allMarks);
  const minMark      = Math.min(...allMarks);
  const totalObt     = allMarks.reduce((a, b) => a + b, 0);
  const totalMax     = marks.reduce((a, m) => a + m.max, 0);
  const overallPct   = ((totalObt / totalMax) * 100).toFixed(2);
  let   totalGpa     = 0;
  let   passCount    = 0;

  marks.forEach((m, i) => {
    const pct  = ((m.obtained / m.max) * 100).toFixed(1);
    const { grade, cls, gpa } = getGrade(parseFloat(pct));
    const pass = parseFloat(pct) >= 40;
    totalGpa += gpa;
    if (pass) passCount++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${m.name}</td>
      <td>${m.max}</td>
      <td>${m.obtained}</td>
      <td>${pct}%</td>
      <td class="${cls}">${grade}</td>
      <td><span class="badge ${pass ? 'pass' : 'fail'}">${pass ? 'PASS' : 'FAIL'}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // ===== Statistics =====
  const cgpa = (totalGpa / marks.length).toFixed(2);
  const statsGrid = document.getElementById('statsGrid');
  const stats = [
    { val: totalObt,         lbl: 'Total Marks',   color: 'var(--primary)' },
    { val: `${overallPct}%`, lbl: 'Overall %',      color: 'hsl(190,85%,50%)' },
    { val: cgpa,             lbl: 'CGPA',           color: 'hsl(150,65%,50%)' },
    { val: maxMark,          lbl: 'Highest Mark',   color: 'hsl(150,65%,50%)' },
    { val: minMark,          lbl: 'Lowest Mark',    color: 'hsl(0,75%,55%)' },
    { val: `${passCount}/${marks.length}`, lbl: 'Subjects Passed', color: 'hsl(45,100%,55%)' },
  ];

  statsGrid.innerHTML = '';
  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="s-val" style="color:${s.color}">${s.val}</div>
      <div class="s-lbl">${s.lbl}</div>
    `;
    statsGrid.appendChild(card);
  });

  // ===== Performance Bars =====
  const perfBars = document.getElementById('perfBars');
  perfBars.innerHTML = '';
  const barColors = ['hsl(252,80%,62%)','hsl(190,85%,50%)','hsl(150,65%,50%)','hsl(45,100%,55%)','hsl(300,65%,55%)','hsl(0,75%,60%)'];

  marks.forEach((m, i) => {
    const pct = ((m.obtained / m.max) * 100).toFixed(1);
    const row = document.createElement('div');
    row.className = 'perf-bar-row';
    row.innerHTML = `
      <span class="subj-name">${m.name}</span>
      <div class="perf-bar-track">
        <div class="perf-bar-fill" style="width:0%;background:${barColors[i % barColors.length]}" data-pct="${pct}"></div>
      </div>
      <span class="pct-label">${pct}%</span>
    `;
    perfBars.appendChild(row);
  });

  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

  // Animate bars after render
  setTimeout(() => {
    document.querySelectorAll('.perf-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 100);
}

// ===== Reset =====
function resetAll() {
  buildInputs();
  document.getElementById('resultsSection').style.display = 'none';
}

// ===== Init =====
buildInputs();
