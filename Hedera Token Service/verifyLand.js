import fs from "fs";
import readline from "readline";

const logFile = "./verification-log.json"; // use relative to current script

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadLog() {
  if (fs.existsSync(logFile)) {
    const data = fs.readFileSync(logFile, "utf-8");
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("❌ Failed to parse verification-log.json:", e.message);
      return [];
    }
  }
  return [];
}

function saveLog(log) {
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    const landIdInput = await ask("Enter Land ID to approve: ");
    const inspector = await ask("Enter your role (Chief/Surveyor): ");
    const name = await ask("Enter your name: ");

    const landId = parseInt(landIdInput.trim(), 10);
    const log = loadLog();

    const entry = log.find(e => Number(e.landId) === landId);

    if (!entry) {
      console.log(`❌ Land ID ${landId} not found.`);
      rl.close();
      return;
    }

    if (!["Chief", "Surveyor"].includes(inspector)) {
      console.log("❌ Invalid role. Must be either 'Chief' or 'Surveyor'.");
      rl.close();
      return;
    }

    // Initialize missing fields
    if (!Array.isArray(entry.approvals)) entry.approvals = [];
    if (!entry.verificationHistory) entry.verificationHistory = [];
    if (typeof entry.verified !== "boolean") entry.verified = false;

    // Add approval if not already there
    if (!entry.approvals.includes(inspector)) {
      entry.approvals.push(inspector);
      entry.verificationHistory.push({
        role: inspector,
        name,
        date: new Date().toISOString()
      });
      console.log(`✅ ${inspector} (${name}) approved Land ID ${landId}`);
    } else {
      console.log(`⚠️ ${inspector} has already approved this parcel.`);
    }

    // Check if both approvals exist
    if (entry.approvals.includes("Chief") && entry.approvals.includes("Surveyor")) {
      entry.verified = true;
      entry.status = "approved";
      console.log(`🎉 Land ID ${landId} is now FULLY VERIFIED! Ready for NFT minting.`);
    } else {
      entry.status = "pending";
      console.log(`⏳ Waiting for both approvals. Current approvals: ${entry.approvals.join(", ")}`);
    }

    saveLog(log);
    rl.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
    rl.close();
  }
}

main();
