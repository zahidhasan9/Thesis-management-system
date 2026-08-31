const { gradeFromMark } = require("../utils/grade");

const sanitizeForEvaluator = (source, userId) => {
  const data = source.toObject ? source.toObject() : { ...source };
  const mine = data.evaluatorAssignments?.find(
    (item) =>
      (item.evaluator?._id || item.evaluator).toString() === userId.toString(),
  );
  [
    "evaluatorMarks",
    "thirdEvaluatorMark",
    "finalMark",
    "bestTwoMarks",
    "finalMarkCalculatedAt",
    "finalMarkStatus",
    "resultPublished",
    "resultPublishedAt",
    "resultPublishedBy",
    "thirdEvaluatorRequirementReason",
  ].forEach((field) => delete data[field]);
  data.evaluatorAssignments = mine ? [mine] : [];
  return data;
};

const sanitizeForStudent = (source) => {
  const data = source.toObject ? source.toObject() : { ...source };
  [
    "evaluatorMarks",
    "thirdEvaluatorMark",
    "evaluatorAssignments",
    "bestTwoMarks",
    "thirdEvaluatorRequirementReason",
    "thirdEvaluatorRequiredBy",
    "evaluationThreshold",
    "resultPublishedBy",
  ].forEach((field) => delete data[field]);

  const published =
    data.resultPublished === true && data.finalMarkStatus === "published";
  data.grade = published ? gradeFromMark(data.finalMark) : undefined;
  delete data.finalMark;
  delete data.finalMarkCalculatedAt;
  if (!data.studentFeedbackPublished) {
    delete data.studentFeedback;
    delete data.studentFeedbackPublishedAt;
  }
  const supervisorId = data.supervisor?.idNo;
  data.supervisor = supervisorId ? { idNo: String(supervisorId) } : null;
  return data;
};

const sanitizeForPublicResult = (source) => {
  const data = source.toObject ? source.toObject() : { ...source };
  return {
    projectId: data.projectId || data._id,
    title: data.title,
    status: data.status,
    supervisor: data.supervisor
      ? {
          name: data.supervisor.name,
          department: data.supervisor.department,
        }
      : null,
    grade: gradeFromMark(data.finalMark),
    resultStatus: data.finalMarkStatus,
    publishedAt: data.resultPublishedAt,
    feedback: data.studentFeedbackPublished
      ? data.studentFeedback
      : undefined,
  };
};

module.exports = {
  sanitizeForEvaluator,
  sanitizeForStudent,
  sanitizeForPublicResult,
};
