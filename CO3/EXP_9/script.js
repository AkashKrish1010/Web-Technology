// CO3 - Experiment 9: Servlet Lifecycle Demonstration

let constructorCalls = 1;
let initCalls = 1;
let serviceCalls = 0;
let destroyCalls = 0;

const valConstructor = document.getElementById('valConstructor');
const valInit = document.getElementById('valInit');
const valService = document.getElementById('valService');
const valDestroy = document.getElementById('valDestroy');
const lifecycleState = document.getElementById('lifecycleState');
const consoleBox = document.getElementById('consoleBox');

const sendReqBtn = document.getElementById('sendReqBtn');
const burstBtn = document.getElementById('burstBtn');
const redeployBtn = document.getElementById('redeployBtn');
const clearLogBtn = document.getElementById('clearLogBtn');

function logConsole(msg, type = '') {
  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = `log-line ${type}`;
  div.textContent = `[${time}] ${msg}`;
  consoleBox.appendChild(div);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function updateMetrics() {
  valConstructor.textContent = constructorCalls;
  valInit.textContent = initCalls;
  valService.textContent = serviceCalls;
  valDestroy.textContent = destroyCalls;
}

// 1. Single Request Dispatch (doGet)
sendReqBtn.addEventListener('click', () => {
  serviceCalls++;
  updateMetrics();
  logConsole(`[LifecycleServlet.doGet()] -> Handled HTTP GET on Thread [worker-${Math.floor(Math.random() * 8) + 1}]. Total Requests = ${serviceCalls}`);
});

// 2. Burst of 10 Concurrent Requests
burstBtn.addEventListener('click', () => {
  logConsole(`--- Initiating Concurrent Batch of 10 Requests ---`, 'text-blue');
  for (let i = 1; i <= 10; i++) {
    serviceCalls++;
    const threadId = Math.floor(Math.random() * 16) + 1;
    setTimeout(() => {
      logConsole(`[LifecycleServlet.service()] -> Concurrent request #${serviceCalls} processed by thread [pool-1-thread-${threadId}]`);
      updateMetrics();
    }, i * 40);
  }
});

// 3. Redeploy Container Simulation (destroy -> constructor -> init)
redeployBtn.addEventListener('click', () => {
  logConsole(`[Tomcat] -> Initiating Application Undeploy...`, 'text-blue');
  
  // Trigger destroy()
  destroyCalls++;
  lifecycleState.textContent = 'DESTROYING / SHUTDOWN';
  lifecycleState.className = 'text-red';
  logConsole(`[LifecycleServlet.destroy()] -> Method called. Releasing open database pools & socket descriptors.`, 'text-blue');
  updateMetrics();

  // Re-instantiate after 600ms
  setTimeout(() => {
    constructorCalls++;
    logConsole(`[Tomcat] -> Rebuilding Servlet context. New instance constructor() called. Instance #${constructorCalls}`);
    updateMetrics();

    setTimeout(() => {
      initCalls++;
      lifecycleState.textContent = 'RUNNING / READY';
      lifecycleState.className = 'text-green';
      logConsole(`[LifecycleServlet.init()] -> Servlet re-initialized with fresh ServletConfig.`, 'text-green');
      updateMetrics();
    }, 400);
  }, 600);
});

// Clear log
clearLogBtn.addEventListener('click', () => {
  consoleBox.innerHTML = '';
});
