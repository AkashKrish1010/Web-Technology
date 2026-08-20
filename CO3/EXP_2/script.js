// CO3 - Experiment 2: Dynamic Student Registration List Using DOM

const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const regNumberInput = document.getElementById('regNumber');
const departmentInput = document.getElementById('department');
const studentListBody = document.getElementById('studentListBody');
const studentCountEl = document.getElementById('studentCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const emptyState = document.getElementById('emptyState');
const formFeedback = document.getElementById('formFeedback');
const inspectorText = document.getElementById('inspectorText');

let serialCounter = 0;

// Update UI metrics and inspector
function updateInspector() {
  const count = studentListBody.children.length;
  studentCountEl.textContent = count;
  
  if (count === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  // Inspect children DOM nodes
  let childDetails = [];
  for (let i = 0; i < studentListBody.children.length; i++) {
    const childRow = studentListBody.children[i];
    // Demonstrating children traversal
    const regText = childRow.querySelector('.student-reg-text')?.textContent || '';
    childDetails.push(`child[${i}]: <tr> (${regText})`);
  }

  inspectorText.textContent = `studentListBody.children.length = ${count}\n` +
    (childDetails.length > 0 ? childDetails.join('\n') : '(No child nodes present)');
}

// Helper to show message
function showFeedback(msg, isSuccess = true) {
  formFeedback.textContent = msg;
  formFeedback.className = 'feedback-msg ' + (isSuccess ? 'success' : 'error');
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className = 'feedback-msg';
  }, 3500);
}

// 1. Add Student (createElement & appendChild)
studentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = studentNameInput.value.trim();
  const regNo = regNumberInput.value.trim().toUpperCase();
  const dept = departmentInput.value;

  if (!name || !regNo || !dept) {
    showFeedback('Please fill in all required fields.', false);
    return;
  }

  // Check duplicate regNo using children traversal
  for (let i = 0; i < studentListBody.children.length; i++) {
    const existingReg = studentListBody.children[i].getAttribute('data-reg');
    if (existingReg === regNo) {
      showFeedback(`Register Number ${regNo} is already registered!`, false);
      return;
    }
  }

  serialCounter++;

  // Create table row element using createElement
  const tr = document.createElement('tr');
  tr.className = 'student-row';
  tr.setAttribute('data-reg', regNo);

  // Avatar Initials
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Create individual td elements or construct HTML
  tr.innerHTML = `
    <td><strong>#${serialCounter}</strong></td>
    <td>
      <div class="student-info-cell">
        <div class="row-avatar">${initials}</div>
        <div>
          <div class="student-name-text">${name}</div>
          <div class="student-reg-text">${regNo}</div>
        </div>
      </div>
    </td>
    <td><span class="dept-chip">${dept}</span></td>
    <td>
      <button type="button" class="btn-remove-row" title="Remove student">🗑️ Remove</button>
    </td>
  `;

  // Attach event to remove button using parentElement & remove()
  const removeBtn = tr.querySelector('.btn-remove-row');
  removeBtn.addEventListener('click', function() {
    // Demonstrating parentElement traversal: button -> td -> tr
    const parentRow = this.parentElement.parentElement;
    
    // Animate removal
    parentRow.style.transition = 'all 0.25s ease';
    parentRow.style.opacity = '0';
    parentRow.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
      // Demonstrating remove() method
      parentRow.remove();
      updateInspector();
      showFeedback(`Removed student (${regNo}) using parentElement.parentElement.remove()`);
    }, 250);
  });

  // Append new row using appendChild()
  studentListBody.appendChild(tr);

  // Reset inputs
  studentNameInput.value = '';
  regNumberInput.value = '';
  departmentInput.value = '';

  showFeedback(`✅ Student ${name} registered successfully!`);
  updateInspector();
});

// 2. Clear All records
clearAllBtn.addEventListener('click', () => {
  if (studentListBody.children.length === 0) {
    showFeedback('List is already empty.', false);
    return;
  }

  if (confirm('Are you sure you want to remove all student records?')) {
    // Clear all children dynamically
    while (studentListBody.firstChild) {
      studentListBody.removeChild(studentListBody.firstChild);
    }
    serialCounter = 0;
    updateInspector();
    showFeedback('All student records cleared.');
  }
});

// Initial load
updateInspector();
