// ===== Question Bank =====
const questions = [
  { id:1, cat:'HTML', q:'Which HTML5 element is used to define navigation links?', opts:['<nav>','<menu>','<header>','<aside>'], ans:0 },
  { id:2, cat:'CSS', q:'Which CSS property is used to create space inside an element\'s border?', opts:['margin','border-spacing','padding','gap'], ans:2 },
  { id:3, cat:'JavaScript', q:'Which method is used to add an element at the end of a JavaScript array?', opts:['append()','push()','add()','insert()'], ans:1 },
  { id:4, cat:'HTML', q:'What does the "alt" attribute in an <img> tag specify?', opts:['Image size','Alternate text for the image','Image alignment','Image source'], ans:1 },
  { id:5, cat:'CSS', q:'Which CSS layout model distributes space along a single axis (row or column)?', opts:['CSS Grid','CSS Float','Flexbox','CSS Table'], ans:2 },
  { id:6, cat:'JavaScript', q:'Which built-in JavaScript object provides mathematical functions?', opts:['Number','Calc','Math','Formula'], ans:2 },
  { id:7, cat:'CSS', q:'Which CSS unit is relative to the viewport width?', opts:['em','rem','px','vw'], ans:3 },
  { id:8, cat:'JavaScript', q:'Which method stops repeated execution of a function set by setInterval()?', opts:['stopInterval()','clearTimeout()','clearInterval()','cancelInterval()'], ans:2 },
  { id:9, cat:'HTML', q:'Which HTML form attribute prevents default browser validation?', opts:['nocheck','novalidate','noverify','skipvalidate'], ans:1 },
  { id:10, cat:'JavaScript', q:'What does DOM stand for?', opts:['Data Object Model','Document Object Model','Dynamic Object Map','Document Orientation Model'], ans:1 },
];

// ===== State =====
let currentQ  = 0;
let score     = 0;
let answered  = [];   // {id, selected, correct}
let timerInt  = null;
let timeLeft  = 600;  // 10 min

// ===== Start =====
function startQuiz() {
  currentQ = 0; score = 0; answered = []; timeLeft = 600;
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizScreen').style.display  = 'block';
  document.getElementById('resultScreen').style.display = 'none';
  document.getElementById('qTotal').textContent = questions.length;
  startTimer();
  renderQuestion();
}

// ===== Timer =====
function startTimer() {
  clearInterval(timerInt);
  timerInt = setInterval(() => {
    timeLeft--;
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    const el = document.getElementById('timer');
    el.textContent = `${m}:${s}`;
    el.classList.toggle('warn', timeLeft <= 60);
    if (timeLeft <= 0) { clearInterval(timerInt); showResults(); }
  }, 1000);
}

// ===== Render Question =====
function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('qNum').textContent       = currentQ + 1;
  document.getElementById('qCategory').textContent  = q.cat;
  document.getElementById('qText').textContent      = q.q;
  document.getElementById('quizProgress').style.width = ((currentQ / questions.length) * 100) + '%';
  document.getElementById('liveScore').textContent  = score;

  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    btn.id = `opt_${i}`;
    btn.onclick = () => selectAnswer(i);
    opts.appendChild(btn);
  });

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = true;
  nextBtn.style.opacity = '0.5';
  nextBtn.style.pointerEvents = 'none';
  nextBtn.textContent = currentQ < questions.length - 1 ? 'Next →' : 'Finish ✓';
}

// ===== Select Answer =====
function selectAnswer(selected) {
  const q = questions[currentQ];
  const correct = selected === q.ans;
  if (correct) score++;

  answered.push({ id: q.id, q: q.q, selected, correct, correctAns: q.ans, opts: q.opts });

  // Highlight options
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans)   btn.classList.add('correct');
    if (i === selected && !correct) btn.classList.add('wrong');
  });

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
  nextBtn.style.pointerEvents = 'auto';
  document.getElementById('liveScore').textContent = score;
}

// ===== Next Question =====
function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) { clearInterval(timerInt); showResults(); }
  else renderQuestion();
}

// ===== Results =====
function showResults() {
  document.getElementById('quizScreen').style.display   = 'none';
  document.getElementById('resultScreen').style.display = 'block';

  const pct = Math.round((score / questions.length) * 100);
  const badges = { 90:'🏆', 70:'🥈', 50:'🥉', 0:'📝' };
  const badge = Object.entries(badges).reverse().find(([k]) => pct >= parseInt(k))[1];
  const labels = { 90:'Excellent! Outstanding performance!', 70:'Good Job! Well done!', 50:'Keep Practicing!', 0:'Better luck next time.' };
  const label = Object.entries(labels).reverse().find(([k]) => pct >= parseInt(k))[1];

  document.getElementById('resultBadge').textContent    = badge;
  document.getElementById('finalScore').textContent     = score;
  document.getElementById('maxScore').textContent       = questions.length;
  document.getElementById('scoreLabel').textContent     = label;

  // Stats
  const correct  = answered.filter(a => a.correct).length;
  const wrong    = answered.filter(a => !a.correct).length;
  const skipped  = questions.length - answered.length;
  document.getElementById('resultStats').innerHTML = `
    <div class="r-stat"><div class="r-val" style="color:hsl(150,65%,50%)">${correct}</div><div class="r-lbl">Correct</div></div>
    <div class="r-stat"><div class="r-val" style="color:hsl(0,75%,55%)">${wrong}</div><div class="r-lbl">Wrong</div></div>
    <div class="r-stat"><div class="r-val" style="color:hsl(45,100%,55%)">${skipped}</div><div class="r-lbl">Skipped</div></div>
    <div class="r-stat"><div class="r-val" style="color:hsl(252,80%,62%)">${pct}%</div><div class="r-lbl">Score</div></div>
  `;

  // Review
  const review = document.getElementById('answersReview');
  review.innerHTML = '';
  answered.forEach(a => {
    const div = document.createElement('div');
    div.className = `review-item ${a.correct ? 'correct' : 'wrong'}`;
    div.innerHTML = `
      <div class="r-q">${a.correct ? '✅' : '❌'} ${a.q}</div>
      <div class="r-ans">
        Your answer: <span class="${a.correct ? 'correct-ans' : 'wrong-ans'}">${a.opts[a.selected]}</span>
        ${!a.correct ? `| Correct: <span class="correct-ans">${a.opts[a.correctAns]}</span>` : ''}
      </div>
    `;
    review.appendChild(div);
  });
}

function restartQuiz() { startQuiz(); }
