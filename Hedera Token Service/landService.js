import fs from "fs";

const VERIFICATION_LOG = "./verification-log.json";

export function loadVerificationLog() {
  try {
    if (!fs.existsSync(VERIFICATION_LOG)) return [];
    const content = fs.readFileSync(VERIFICATION_LOG, "utf8");
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function saveVerificationLog(data) {
  fs.writeFileSync(VERIFICATION_LOG, JSON.stringify(data, null, 2));
}

export function getLandEntryById(log, landId) {
  return log.find((e) => Number(e.landId) === Number(landId));
}

export function ensureEntryDefaults(entry) {
  if (!Array.isArray(entry.approvals)) entry.approvals = [];
  if (!entry.verificationHistory) entry.verificationHistory = [];
  if (typeof entry.verified !== "boolean") entry.verified = false;
  if (!entry.status) entry.status = "pending";
}

export function applyApproval(entry, role, name) {
  ensureEntryDefaults(entry);
  if (!entry.approvals.includes(role)) {
    entry.approvals.push(role);
    entry.verificationHistory.push({ role, name, date: new Date().toISOString() });
  }
  const hasChief = entry.approvals.includes("Chief");
  const hasSurveyor = entry.approvals.includes("Surveyor");
  if (hasChief && hasSurveyor) {
    entry.verified = true;
    entry.status = "approved";
  } else {
    entry.status = "pending";
  }
}


