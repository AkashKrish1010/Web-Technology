// ===== Custom Logger =====
function appendLog(type, msg) {
  const consoleOutput = document.getElementById('consoleOutput');
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${msg}`;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
  document.getElementById('consoleOutput').innerHTML = '';
  appendLog('info', 'Console cleared.');
}

// ===== Test 1: Uncaught ReferenceError =====
function triggerReferenceError() {
  appendLog('warn', 'Executing triggerReferenceError()... Check DevTools Console (F12)');
  console.log('Attempting to access non-existent variable nonExistentVar...');
  try {
    // Intentional ReferenceError
    let value = nonExistentVar + 10;
  } catch (err) {
    console.error('Caught in DevTools Console:', err);
    appendLog('error', `Uncaught ReferenceError: ${err.message}`);
  }
}

// ===== Test 2: TypeError =====
function triggerTypeError() {
  appendLog('warn', 'Executing triggerTypeError()...');
  try {
    const num = 42;
    // Intentional TypeError (calling number as a function)
    num.toUpperCase();
  } catch (err) {
    console.error('TypeError caught:', err);
    appendLog('error', `TypeError: ${err.message}`);
  }
}

// ===== Test 3: Logical Error =====
function triggerDivisionByZero() {
  appendLog('warn', 'Executing triggerDivisionByZero() (Logical Bug)...');
  const numerator = 100;
  const denominator = 0;
  console.log(`Calculating ${numerator} / ${denominator}`);
  const result = numerator / denominator;
  
  console.warn('Logical Warning: Division by zero produced Infinity in JS!');
  appendLog('warn', `Logical Output: ${numerator} / 0 = ${result} (Check logic with breakpoints)`);
}

// ===== Test 4: Safe Calculation with try...catch...finally =====
function triggerSafeCalculation() {
  appendLog('info', 'Executing triggerSafeCalculation() with try...catch...finally...');
  
  try {
    const jsonString = '{"student": "Akash", "score": 95}';
    console.log('Parsing JSON:', jsonString);
    const data = JSON.parse(jsonString);
    
    if (data.score > 90) {
      appendLog('success', `SUCCESS: Student ${data.student} scored ${data.score}% (Grade A+)`);
    }
  } catch (err) {
    console.error('JSON Parse Error:', err);
    appendLog('error', `JSON Error: ${err.message}`);
  } finally {
    console.log('Finally block executed regardless of outcome.');
    appendLog('info', 'Finally block executed cleanly.');
  }
}

// ===== Test 5: Broken CSS Toggle =====
function toggleBrokenCSS() {
  const target = document.getElementById('targetElement');
  const badge = document.getElementById('inspectBadge');
  
  target.classList.toggle('broken-style');
  if (target.classList.contains('broken-style')) {
    badge.textContent = 'Status: BROKEN CSS APPLIED';
    badge.style.color = 'var(--error)';
    appendLog('error', 'Applied .broken-style! Inspect element styles in Elements panel.');
  } else {
    badge.textContent = 'Status: Normal';
    badge.style.color = 'var(--primary)';
    appendLog('success', 'Restored normal element styles.');
  }
}

// ===== Interactive Eval Input =====
function executeEval() {
  const input = document.getElementById('evalInput');
  const code = input.value.trim();
  if (!code) return;

  appendLog('info', `> ${code}`);
  try {
    const res = eval(code);
    appendLog('success', `< ${res}`);
    console.log('Eval result:', res);
  } catch (err) {
    appendLog('error', `< Error: ${err.message}`);
    console.error('Eval error:', err);
  }
  input.value = '';
}

document.getElementById('evalInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') executeEval();
});
