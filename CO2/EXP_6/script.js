// ===== State =====
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';
let editingId = null;

// ===== Save & Render =====
function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

function render() {
  const list   = document.getElementById('taskList');
  const empty  = document.getElementById('emptyMsg');
  const total  = tasks.length;
  const done   = tasks.filter(t => t.done).length;
  const pct    = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('totalCount').textContent = `${total} task${total !== 1 ? 's' : ''}`;
  document.getElementById('doneCount').textContent  = `${done} done`;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '%';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active')    return !t.done;
    if (currentFilter === 'completed') return t.done;
    if (currentFilter === 'high')      return t.priority === 'high';
    return true;
  });

  list.innerHTML = '';
  empty.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : ''}`;
    li.dataset.id = task.id;

    if (editingId === task.id) {
      li.innerHTML = `
        <input class="task-edit-input" id="editInput_${task.id}" value="${escHtml(task.text)}" maxlength="120" />
        <div class="task-actions">
          <button class="btn-edit" title="Save" onclick="saveEdit(${task.id})">💾</button>
          <button class="btn-del" title="Cancel" onclick="cancelEdit()">✖</button>
        </div>
      `;
      setTimeout(() => document.getElementById(`editInput_${task.id}`)?.focus(), 50);
    } else {
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}
               onchange="toggleDone(${task.id})" title="Mark as done" />
        <div class="priority-dot ${task.priority}"></div>
        <span class="task-text">${escHtml(task.text)}</span>
        <div class="task-actions">
          <button class="btn-edit" title="Edit" onclick="startEdit(${task.id})">✏️</button>
          <button class="btn-del"  title="Delete" onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
    }
    list.appendChild(li);
  });
}

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== CRUD =====
function addTask() {
  const input    = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const text     = input.value.trim();
  if (!text) { input.focus(); return; }

  const task = { id: Date.now(), text, priority, done: false, created: new Date().toISOString() };
  tasks.unshift(task);
  save();
  render();
  input.value = '';
  input.focus();
}

function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; save(); render(); }
}

function startEdit(id) { editingId = id; render(); }

function saveEdit(id) {
  const input = document.getElementById(`editInput_${id}`);
  const text  = input?.value.trim();
  if (!text) return;
  const task = tasks.find(t => t.id === id);
  if (task) { task.text = text; save(); }
  editingId = null;
  render();
}

function cancelEdit() { editingId = null; render(); }

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  save(); render();
}

// ===== Filter =====
function setFilter(btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  render();
}

// ===== Enter key to add =====
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ===== Init with sample tasks =====
if (tasks.length === 0) {
  tasks = [
    { id: 1, text: 'Complete Web Technology assignment', priority: 'high', done: false, created: new Date().toISOString() },
    { id: 2, text: 'Study for Data Structures exam', priority: 'high', done: false, created: new Date().toISOString() },
    { id: 3, text: 'Submit lab record', priority: 'medium', done: true, created: new Date().toISOString() },
  ];
  save();
}
render();
