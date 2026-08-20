// CO3 - Experiment 6: Basic Java Servlet for Dynamic Content Generation

const studentNameInput = document.getElementById('studentName');
const courseNameInput = document.getElementById('courseName');
const simulateBtn = document.getElementById('simulateBtn');
const simulationView = document.getElementById('simulationView');
const closeSimBtn = document.getElementById('closeSimBtn');

const simStudent = document.getElementById('simStudent');
const simCourse = document.getElementById('simCourse');
const simTimestamp = document.getElementById('simTimestamp');

let timerInterval = null;

function updateLiveTimestamp() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  simTimestamp.textContent = now.toLocaleString('en-US', options);
}

simulateBtn.addEventListener('click', () => {
  const sName = studentNameInput.value.trim() || 'Arjun Sharma (RA2211003010042)';
  const cName = courseNameInput.value.trim() || 'Web Technology (21CS301T)';

  simStudent.textContent = sName;
  simCourse.textContent = cName;

  updateLiveTimestamp();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateLiveTimestamp, 1000);

  simulationView.style.display = 'block';
  simulationView.scrollIntoView({ behavior: 'smooth' });
});

closeSimBtn.addEventListener('click', () => {
  if (timerInterval) clearInterval(timerInterval);
  simulationView.style.display = 'none';
});
