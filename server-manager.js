const { spawn, execSync } = require("child_process");
const readline = require("readline");
const path = require("path");

let frontendServer = null;
let backendServer = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Configuration
const BACKEND_PORT = 5000;
const FRONTEND_PORT = 8080;
const BACKEND_DIR = path.join(__dirname, "backend");
const FRONTEND_DIR = path.join(__dirname, "frontend");

function findProcessByPort(port) {
  try {
    // For Windows
    const result = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = result.split("\n").filter((line) => line.includes(`LISTENING`));

    if (lines.length > 0) {
      const lastLine = lines[0];
      const pid = lastLine.trim().split(/\s+/).pop();
      return pid;
    }
    return null;
  } catch (error) {
    console.log(`No process found on port ${port}`);
    return null;
  }
}

function killProcessOnPort(port) {
  const pid = findProcessByPort(port);
  if (pid) {
    try {
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Process with PID ${pid} on port ${port} was killed`);
      return true;
    } catch (error) {
      console.error(`Failed to kill process on port ${port}:`, error.message);
      return false;
    }
  }
  return true; // No process to kill is still a success
}

function startBackendServer() {
  console.log("Starting backend server...");
  killProcessOnPort(BACKEND_PORT);

  // Use npm run directly in backend folder
  backendServer = spawn("cmd.exe", ["/c", "cd backend && npm run dev"], {
    shell: true,
    stdio: "pipe",
  });

  backendServer.stdout.on("data", (data) => {
    console.log(`[BACKEND]: ${data.toString().trim()}`);
  });

  backendServer.stderr.on("data", (data) => {
    console.error(`[BACKEND ERROR]: ${data.toString().trim()}`);
  });

  backendServer.on("close", (code) => {
    console.log(`Backend server process exited with code ${code}`);
    backendServer = null;
  });
}

function startFrontendServer() {
  console.log("Starting frontend server...");
  killProcessOnPort(FRONTEND_PORT);

  // Use npm run directly in frontend folder
  frontendServer = spawn("cmd.exe", ["/c", "cd frontend && npm run dev"], {
    shell: true,
    stdio: "pipe",
  });

  frontendServer.stdout.on("data", (data) => {
    console.log(`[FRONTEND]: ${data.toString().trim()}`);
  });

  frontendServer.stderr.on("data", (data) => {
    console.error(`[FRONTEND ERROR]: ${data.toString().trim()}`);
  });

  frontendServer.on("close", (code) => {
    console.log(`Frontend server process exited with code ${code}`);
    frontendServer = null;
  });
}

function restartBackendServer() {
  if (backendServer) {
    backendServer.kill();
    backendServer = null;
  } else {
    killProcessOnPort(BACKEND_PORT);
  }
  startBackendServer();
}

function restartFrontendServer() {
  if (frontendServer) {
    frontendServer.kill();
    frontendServer = null;
  } else {
    killProcessOnPort(FRONTEND_PORT);
  }
  startFrontendServer();
}

function restartAllServers() {
  restartBackendServer();
  setTimeout(() => {
    restartFrontendServer();
  }, 2000); // Small delay to ensure backend starts first
}

function stopAllServers() {
  if (backendServer) {
    backendServer.kill();
    backendServer = null;
  } else {
    killProcessOnPort(BACKEND_PORT);
  }

  if (frontendServer) {
    frontendServer.kill();
    frontendServer = null;
  } else {
    killProcessOnPort(FRONTEND_PORT);
  }

  console.log("All servers stopped");
}

function showMenu() {
  console.log("\n========== SERVER MANAGER ==========");
  console.log("1. Start all servers");
  console.log("2. Restart all servers");
  console.log("3. Restart backend server");
  console.log("4. Restart frontend server");
  console.log("5. Stop all servers");
  console.log("6. Exit");
  console.log("===================================\n");

  rl.question("Select an option (1-6): ", (answer) => {
    switch (answer) {
      case "1":
        restartAllServers();
        setTimeout(showMenu, 3000);
        break;
      case "2":
        restartAllServers();
        setTimeout(showMenu, 3000);
        break;
      case "3":
        restartBackendServer();
        setTimeout(showMenu, 3000);
        break;
      case "4":
        restartFrontendServer();
        setTimeout(showMenu, 3000);
        break;
      case "5":
        stopAllServers();
        setTimeout(showMenu, 1000);
        break;
      case "6":
        stopAllServers();
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("Invalid option. Please try again.");
        setTimeout(showMenu, 500);
    }
  });
}

// Handle process termination
process.on("SIGINT", () => {
  stopAllServers();
  rl.close();
  process.exit(0);
});

// Clear console and show welcome message
console.clear();
console.log("========================================");
console.log("   RentalPortal Server Manager v1.0");
console.log("========================================");
console.log("This utility manages both frontend and backend servers in a single terminal.");
console.log("No more terminal chaos during development!");
console.log("----------------------------------------");

// Kill any existing processes first
console.log("Cleaning up any existing server processes...");
killProcessOnPort(BACKEND_PORT);
killProcessOnPort(FRONTEND_PORT);
console.log("Done!");

showMenu();
