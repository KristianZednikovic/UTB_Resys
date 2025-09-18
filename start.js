const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting UTB Reservation System...\n");

// Start the backend server
const backend = spawn("node", ["server.js"], {
  cwd: path.join(__dirname, "backend"),
  stdio: "inherit",
  shell: true,
});

backend.on("error", (err) => {
  console.error("❌ Failed to start backend server:", err);
});

backend.on("close", (code) => {
  console.log(`Backend server exited with code ${code}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down servers...");
  backend.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down servers...");
  backend.kill("SIGTERM");
  process.exit(0);
});

console.log("✅ Backend server started on http://localhost:5000");
console.log("📱 Open your browser and navigate to http://localhost:5000");
console.log(
  "🔄 You can now refresh the page at /reservations without any issues!"
);
console.log("\nPress Ctrl+C to stop the servers");
