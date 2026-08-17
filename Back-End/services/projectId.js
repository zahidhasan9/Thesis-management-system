const ProjectCounter = require("../models/ProjectCounter");

const yearPair = (startYear) =>
  `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}`;

const normalizeAcademicSession = (value, fallbackDate = new Date()) => {
  const text = String(value || "").trim();
  const fourDigit = text.match(/\b(19|20)\d{2}\s*[-/]\s*(?:(19|20)?\d{2})\b/);
  if (fourDigit) return yearPair(Number(fourDigit[0].slice(0, 4)));

  const short = text.match(/\b(\d{2})\s*[-/]\s*(\d{2})\b/);
  if (short) return `${short[1]}-${short[2]}`;

  return yearPair(new Date(fallbackDate).getFullYear());
};

const assignProjectId = async (thesis, student) => {
  if (thesis.projectId) return thesis.projectId;

  const academicSession = normalizeAcademicSession(
    student?.session || student?.batch,
    thesis.createdAt || new Date(),
  );
  const counter = await ProjectCounter.findOneAndUpdate(
    { academicSession },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: false },
  );

  const projectId = `${academicSession}-${String(counter.sequence).padStart(3, "0")}`;
  await thesis.constructor.updateOne(
    { _id: thesis._id },
    { $set: { projectId, academicSession, sessionSerial: counter.sequence } },
  );
  thesis.projectId = projectId;
  thesis.academicSession = academicSession;
  thesis.sessionSerial = counter.sequence;
  return projectId;
};

const ensureProjectIds = async (theses) => {
  for (const thesis of theses) {
    await assignProjectId(thesis, thesis.student);
  }
  return theses;
};

module.exports = {
  assignProjectId,
  ensureProjectIds,
  normalizeAcademicSession,
};
