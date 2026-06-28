/**
 * QuestMe — Unified Dev Startup Script
 *
 * Starts all services with a single command: `npm run dev:all`
 *
 * Services:
 *  - Expo (React Native)  → port 8081
 *  - FastAPI (Python)     → port 8000
 *  - Go Realtime WS       → port 8082
 *  - Go Geo Service        → port 8083
 *  - Go Media Pipeline     → port 8084
 *
 * Missing runtimes are detected and skipped gracefully.
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── Colors ────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const LABELS = {
  expo: `${c.blue}[expo]${c.reset}`,
  api: `${c.green}[api]${c.reset}`,
  realtime: `${c.magenta}[ws]${c.reset}`,
  geo: `${c.cyan}[geo]${c.reset}`,
  media: `${c.yellow}[media]${c.reset}`,
  system: `${c.bright}[questme]${c.reset}`,
};

// ─── Runtime Detection ─────────────────────────────────

function commandExists(cmd) {
  try {
    execSync(`where ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getCommandVersion(cmd, flag = '--version') {
  try {
    return execSync(`${cmd} ${flag}`, { encoding: 'utf-8' }).trim().split('\n')[0];
  } catch {
    return null;
  }
}

function detectRuntimes() {
  const runtimes = {
    node: { available: commandExists('node'), version: getCommandVersion('node') },
    python: { available: false, cmd: null, version: null },
    go: { available: commandExists('go'), version: getCommandVersion('go', 'version') },
    rust: { available: commandExists('cargo'), version: getCommandVersion('cargo', '--version') },
  };

  // Python can be `python` or `python3` or `py`
  for (const cmd of ['python', 'python3', 'py']) {
    if (commandExists(cmd)) {
      runtimes.python = { available: true, cmd, version: getCommandVersion(cmd, '--version') };
      break;
    }
  }

  return runtimes;
}

// ─── Python Venv Setup ─────────────────────────────────

function ensurePythonVenv(pythonCmd) {
  const backendDir = path.join(__dirname, 'backend');
  const venvDir = path.join(backendDir, '.venv');
  const isWin = process.platform === 'win32';
  const pip = isWin
    ? path.join(venvDir, 'Scripts', 'pip.exe')
    : path.join(venvDir, 'bin', 'pip');
  const pythonVenv = isWin
    ? path.join(venvDir, 'Scripts', 'python.exe')
    : path.join(venvDir, 'bin', 'python');

  if (!fs.existsSync(pip)) {
    console.log(`${LABELS.system} Creating Python venv in backend/.venv ...`);
    execSync(`${pythonCmd} -m venv "${venvDir}"`, { cwd: backendDir, stdio: 'inherit' });
  }

  // Install deps if requirements changed
  const reqFile = path.join(backendDir, 'requirements.txt');
  const stampFile = path.join(venvDir, '.deps-installed');
  const reqMtime = fs.statSync(reqFile).mtimeMs;
  const stampMtime = fs.existsSync(stampFile) ? fs.statSync(stampFile).mtimeMs : 0;

  if (reqMtime > stampMtime) {
    console.log(`${LABELS.system} Installing Python dependencies...`);
    execSync(`"${pip}" install -r requirements.txt`, { cwd: backendDir, stdio: 'inherit' });
    fs.writeFileSync(stampFile, new Date().toISOString());
  }

  return pythonVenv;
}

// ─── Process Spawning ──────────────────────────────────

const children = [];

function spawnService(label, cmd, args, cwd, env = {}) {
  const child = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const prefix = LABELS[label] || `[${label}]`;

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => console.log(`${prefix} ${line}`));
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => console.log(`${prefix} ${c.dim}${line}${c.reset}`));
  });

  child.on('error', (err) => {
    console.log(`${prefix} ${c.red}Failed to start: ${err.message}${c.reset}`);
  });

  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`${prefix} ${c.red}Exited with code ${code}${c.reset}`);
    }
  });

  children.push({ label, child });
  return child;
}

// ─── Cleanup ───────────────────────────────────────────

function cleanup() {
  console.log(`\n${LABELS.system} Shutting down all services...`);
  children.forEach(({ label, child }) => {
    try {
      if (!child.killed) {
        child.kill('SIGTERM');
        console.log(`${LABELS.system} Stopped ${label}`);
      }
    } catch { /* ignore */ }
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
  children.forEach(({ child }) => {
    try { if (!child.killed) child.kill(); } catch { /* ignore */ }
  });
});

// ─── Main ──────────────────────────────────────────────

function main() {
  console.log(`\n${c.bright}╔══════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bright}║     🗺️  QuestMe — Dev Environment     ║${c.reset}`);
  console.log(`${c.bright}╚══════════════════════════════════════╝${c.reset}\n`);

  const runtimes = detectRuntimes();

  // Print detected runtimes
  console.log(`${LABELS.system} Detected runtimes:`);
  console.log(`  Node.js   ${runtimes.node.available ? c.green + '✓' : c.red + '✗'} ${c.dim}${runtimes.node.version || ''}${c.reset}`);
  console.log(`  Python    ${runtimes.python.available ? c.green + '✓' : c.yellow + '○'} ${c.dim}${runtimes.python.version || 'not found (API will be skipped)'}${c.reset}`);
  console.log(`  Go        ${runtimes.go.available ? c.green + '✓' : c.yellow + '○'} ${c.dim}${runtimes.go.version || 'not found (microservices will be skipped)'}${c.reset}`);
  console.log(`  Rust      ${runtimes.rust.available ? c.green + '✓' : c.yellow + '○'} ${c.dim}${runtimes.rust.version || 'not found (native modules will be skipped)'}${c.reset}`);
  console.log('');

  // 1. Always start Expo (required)
  console.log(`${LABELS.system} Starting Expo dev server on LAN...`);
  spawnService('expo', 'npx', ['expo', 'start', '--lan'], __dirname);

  // 2. Python FastAPI backend
  if (runtimes.python.available) {
    try {
      const pythonBin = ensurePythonVenv(runtimes.python.cmd);
      console.log(`${LABELS.system} Starting FastAPI backend on :8000 ...`);
      spawnService(
        'api',
        `"${pythonBin}"`,
        ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'],
        path.join(__dirname, 'backend')
      );
    } catch (err) {
      console.log(`${LABELS.api} ${c.yellow}Skipped: ${err.message}${c.reset}`);
    }
  } else {
    console.log(`${LABELS.system} ${c.yellow}Python not found — API backend skipped${c.reset}`);
    console.log(`${LABELS.system} ${c.dim}The app will work in offline/local mode${c.reset}`);
  }

  // 3. Go microservices
  if (runtimes.go.available) {
    const goServices = [
      { label: 'realtime', dir: 'services/realtime', port: '8082' },
      { label: 'geo', dir: 'services/geo', port: '8083' },
      { label: 'media', dir: 'services/media', port: '8084' },
    ];

    goServices.forEach(({ label, dir, port }) => {
      const fullDir = path.join(__dirname, dir);
      if (fs.existsSync(path.join(fullDir, 'main.go'))) {
        console.log(`${LABELS.system} Starting Go ${label} on :${port} ...`);
        spawnService(label, 'go', ['run', 'main.go'], fullDir);
      }
    });
  } else {
    console.log(`${LABELS.system} ${c.yellow}Go not found — microservices skipped${c.reset}`);
  }

  // 4. Rust — just run tests if available (native modules compile separately)
  if (runtimes.rust.available) {
    const rustModules = ['geo-engine', 'crypto-engine', 'data-parser'];
    rustModules.forEach((mod) => {
      const modDir = path.join(__dirname, 'native-modules', mod);
      if (fs.existsSync(path.join(modDir, 'Cargo.toml'))) {
        console.log(`${LABELS.system} ${c.dim}Rust module '${mod}' available — build with: cd native-modules/${mod} && cargo build --release${c.reset}`);
      }
    });
  }

  // Summary
  console.log('');
  console.log(`${LABELS.system} ${c.green}All available services started!${c.reset}`);
  console.log(`${LABELS.system} Endpoints:`);
  console.log(`  ${c.blue}Expo${c.reset}        → http://localhost:8081`);
  if (runtimes.python.available) {
    console.log(`  ${c.green}API${c.reset}         → http://localhost:8000`);
    console.log(`  ${c.green}Swagger${c.reset}     → http://localhost:8000/docs`);
  }
  if (runtimes.go.available) {
    console.log(`  ${c.magenta}WebSocket${c.reset}   → ws://localhost:8082/ws`);
    console.log(`  ${c.cyan}Geo API${c.reset}     → http://localhost:8083`);
    console.log(`  ${c.yellow}Media API${c.reset}   → http://localhost:8084`);
  }
  console.log(`\n${LABELS.system} Press ${c.bright}Ctrl+C${c.reset} to stop all services\n`);
}

main();
