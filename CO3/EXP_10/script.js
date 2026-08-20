// CO3 - Experiment 10: Thread-Safe Concurrent Visitor Counter Using Servlet

let unsafeCount = 0;
let safeCount = 0;
let isSimulating = false;

const unsafeCounterEl = document.getElementById('unsafeCounter');
const safeCounterEl = document.getElementById('safeCounter');
const lostUpdatesCountEl = document.getElementById('lostUpdatesCount');

const singleHitBtn = document.getElementById('singleHitBtn');
const concurrent50Btn = document.getElementById('concurrent50Btn');
const concurrent200Btn = document.getElementById('concurrent200Btn');
const resetCountersBtn = document.getElementById('resetCountersBtn');

const progressBox = document.getElementById('progressBox');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

function updateDisplays() {
  unsafeCounterEl.textContent = unsafeCount;
  safeCounterEl.textContent = safeCount;
  const lost = Math.max(0, safeCount - unsafeCount);
  lostUpdatesCountEl.textContent = `${lost} updates lost!`;
}

// 1. Single Hit
singleHitBtn.addEventListener('click', () => {
  if (isSimulating) return;
  unsafeCount++;
  safeCount++;
  updateDisplays();
});

// 2. High-Contention Concurrent Simulation (Demonstrates read-modify-write race condition)
function simulateConcurrentTraffic(totalThreads, raceHazardProbability) {
  if (isSimulating) return;
  isSimulating = true;

  progressBox.style.display = 'block';
  let completed = 0;

  // We simulate worker threads hitting the shared counter simultaneously
  // In an atomic counter: count = count + 1 (always succeeds)
  // In an unsafe primitive: with high thread contention, multiple threads read the same stale value
  for (let i = 0; i < totalThreads; i++) {
    // Stagger slightly to mimic thread scheduling latency
    setTimeout(() => {
      // 1. Thread-safe atomic execution: guarantees exact increment
      safeCount++;

      // 2. Unsafe primitive execution: simulated thread interleaving / race collision
      // When multiple concurrent threads collide, some increments are silently dropped
      const suffersRaceHazard = Math.random() < raceHazardProbability;
      if (!suffersRaceHazard) {
        unsafeCount++;
      }

      completed++;
      progressText.textContent = `${completed} / ${totalThreads}`;
      progressFill.style.width = `${(completed / totalThreads) * 100}%`;
      updateDisplays();

      if (completed === totalThreads) {
        isSimulating = false;
        setTimeout(() => {
          progressBox.style.display = 'none';
        }, 800);
      }
    }, Math.random() * 600);
  }
}

concurrent50Btn.addEventListener('click', () => {
  simulateConcurrentTraffic(50, 0.22); // 22% collision hazard under 50 threads
});

concurrent200Btn.addEventListener('click', () => {
  simulateConcurrentTraffic(200, 0.38); // 38% collision hazard under 200 threads
});

// 3. Reset Counters
resetCountersBtn.addEventListener('click', () => {
  if (isSimulating) return;
  unsafeCount = 0;
  safeCount = 0;
  updateDisplays();
  lostUpdatesCountEl.textContent = '0';
});
