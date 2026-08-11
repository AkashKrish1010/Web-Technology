// ===== Calculator State =====
let expression = '';
let justEvaluated = false;
let openParens = 0;

const displayExpr   = document.getElementById('expression');
const displayResult = document.getElementById('result');

// ===== Update Display =====
function updateDisplay(expr, res) {
  displayExpr.textContent = expr;
  displayResult.textContent = res;
  displayResult.classList.toggle('shrink', String(res).length > 12);
}

// ===== Append to Expression =====
function append(val) {
  if (justEvaluated && /[0-9.]/.test(val)) expression = '';
  if (justEvaluated && /[+\-*\/]/.test(val)) { /* keep result, append operator */ }
  justEvaluated = false;
  expression += val;
  updateDisplay(expression, '');
}

// ===== Handle Buttons =====
document.getElementById('calculator').addEventListener('click', function(e) {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const val    = btn.dataset.val;

  switch (action) {
    case 'num':
      append(val);
      break;

    case 'op':
      // Prevent double operators
      if (/[+\-*\/]$/.test(expression)) expression = expression.slice(0, -1);
      append(val);
      break;

    case 'dot':
      // Only one dot per number segment
      const parts = expression.split(/[+\-*\/()]/);
      const last = parts[parts.length - 1];
      if (!last.includes('.')) append('.');
      break;

    case 'ac':
      expression = '';
      openParens = 0;
      justEvaluated = false;
      updateDisplay('', '0');
      break;

    case 'del':
      if (expression.slice(-1) === '(') openParens--;
      if (expression.slice(-1) === ')') openParens++;
      expression = expression.slice(0, -1);
      updateDisplay(expression, '');
      break;

    case 'percent':
      try {
        const pVal = evaluate(expression) / 100;
        expression = String(pVal);
        updateDisplay(expression, '');
      } catch { updateDisplay(expression, 'Error'); }
      break;

    case 'sign':
      if (expression && !isNaN(evaluate(expression))) {
        const n = evaluate(expression);
        expression = String(-n);
        updateDisplay(expression, '');
      }
      break;

    case 'paren':
      // Toggle: open if needed, else close
      if (openParens === 0 || /[+\-*\/.(]$/.test(expression)) {
        append('(');
        openParens++;
      } else {
        append(')');
        openParens--;
      }
      break;

    // Scientific functions
    case 'sin':   appendFn('Math.sin('); break;
    case 'cos':   appendFn('Math.cos('); break;
    case 'tan':   appendFn('Math.tan('); break;
    case 'log':   appendFn('Math.log10('); break;
    case 'ln':    appendFn('Math.log('); break;
    case 'sqrt':  appendFn('Math.sqrt('); break;
    case 'pow':   append('**'); break;
    case 'pi':    append(String(Math.PI)); break;
    case 'euler': append(String(Math.E)); break;

    case 'eq':
      if (!expression) break;
      try {
        const result = evaluate(expression);
        updateDisplay(expression + ' =', formatNum(result));
        expression = String(result);
        justEvaluated = true;
      } catch {
        updateDisplay(expression, 'Error');
        expression = '';
      }
      break;
  }
});

function appendFn(fn) {
  justEvaluated = false;
  expression += fn;
  openParens++;
  updateDisplay(expression, '');
}

// ===== Safe Evaluator =====
function evaluate(expr) {
  // Replace display characters with JS equivalents
  const cleaned = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');
  // Close any unclosed parentheses
  let sanitized = cleaned + ')'.repeat(openParens > 0 ? openParens : 0);
  // Whitelist characters
  if (/[^0-9+\-*/.()MathsincotalogqrEB _]/.test(sanitized)) throw new Error('Invalid');
  return Function('"use strict"; return (' + sanitized + ')')();
}

function formatNum(n) {
  if (!isFinite(n)) return 'Error';
  // Round to 10 significant digits
  return parseFloat(n.toPrecision(10)).toString();
}

// ===== Keyboard Support =====
document.addEventListener('keydown', function(e) {
  const key = e.key;
  if (/[0-9]/.test(key))   { append(key); return; }
  if (key === '.')          { document.getElementById('btn-dot').click(); return; }
  if (['+','-','*','/'].includes(key)) { document.querySelector(`[data-val="${key}"]`)?.click(); return; }
  if (key === 'Enter' || key === '=') { document.getElementById('btn-eq').click(); return; }
  if (key === 'Backspace')  { document.getElementById('btn-del').click(); return; }
  if (key === 'Escape')     { document.getElementById('btn-ac').click(); return; }
  if (key === '%')          { document.getElementById('btn-pct').click(); return; }
});
