const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateFinalMark,
  getEvaluationState,
} = require("../services/evaluationService");
const {
  sanitizeForEvaluator,
  sanitizeForStudent,
  sanitizeForPublicResult,
} = require("../services/evaluationPrivacy");

const assignment = (position, evaluator, mark, status = "mark_submitted") => ({
  position,
  evaluator,
  mark,
  status,
});

test("two submitted marks calculate their average", () => {
  const result = calculateFinalMark({
    evaluatorAssignments: [
      assignment(1, "u1", 70),
      assignment(2, "u2", 74),
    ],
    evaluationThreshold: 10,
  });
  assert.equal(result.finalMark, 72);
  assert.deepEqual(result.bestTwoMarks, [74, 70]);
});

test("three submitted marks calculate the best-two average", () => {
  const result = calculateFinalMark({
    evaluatorAssignments: [
      assignment(1, "u1", 65),
      assignment(2, "u2", 78),
      assignment(3, "u3", 72),
    ],
    thirdEvaluatorRequired: true,
    evaluationThreshold: 10,
  });
  assert.equal(result.finalMark, 75);
  assert.deepEqual(result.bestTwoMarks, [78, 72]);
});

test("difference greater than threshold requires a third evaluator", () => {
  const state = getEvaluationState({
    evaluatorAssignments: [
      assignment(1, "u1", 75),
      assignment(2, "u2", 60),
    ],
    evaluationThreshold: 10,
  });
  assert.equal(state.automaticallyRequired, true);
  assert.equal(state.difference, 15);
});

test("difference equal to threshold does not require a third evaluator", () => {
  const state = getEvaluationState({
    evaluatorAssignments: [
      assignment(1, "u1", 70),
      assignment(2, "u2", 60),
    ],
    evaluationThreshold: 10,
  });
  assert.equal(state.automaticallyRequired, false);
});

test("required third evaluation keeps final mark pending until submitted", () => {
  const result = calculateFinalMark({
    evaluatorAssignments: [
      assignment(1, "u1", 65),
      assignment(2, "u2", 78),
      assignment(3, "u3", null, "accepted"),
    ],
    thirdEvaluatorRequired: true,
    evaluationThreshold: 10,
  });
  assert.equal(result.finalMark, null);
});

test("invalid or unsubmitted marks are ignored", () => {
  const result = calculateFinalMark({
    evaluatorAssignments: [
      assignment(1, "u1", 70),
      assignment(2, "u2", 120),
    ],
    evaluationThreshold: 100,
  });
  assert.equal(result.finalMark, null);
});

test("evaluator response contains only their own assignment and no final result", () => {
  const source = {
    finalMark: 80,
    bestTwoMarks: [82, 78],
    evaluatorAssignments: [
      assignment(1, "u1", 82),
      { ...assignment(2, "u2", 78), feedback: "private" },
    ],
  };
  const response = sanitizeForEvaluator(source, "u1");
  assert.equal(response.finalMark, undefined);
  assert.equal(response.bestTwoMarks, undefined);
  assert.equal(response.evaluatorAssignments.length, 1);
  assert.equal(response.evaluatorAssignments[0].evaluator, "u1");
});

test("student cannot see evaluator data or an unpublished final mark", () => {
  const response = sanitizeForStudent({
    finalMark: 80,
    finalMarkStatus: "calculated",
    resultPublished: false,
    bestTwoMarks: [82, 78],
    evaluatorAssignments: [assignment(1, "u1", 82)],
  });
  assert.equal(response.finalMark, undefined);
  assert.equal(response.bestTwoMarks, undefined);
  assert.equal(response.evaluatorAssignments, undefined);
});

test("student can see a published final mark", () => {
  const response = sanitizeForStudent({
    finalMark: 80,
    finalMarkStatus: "published",
    resultPublished: true,
  });
  assert.equal(response.finalMark, 80);
});

test("student cannot see unpublished approved feedback", () => {
  const response = sanitizeForStudent({
    studentFeedback: "Internal approved draft",
    studentFeedbackPublished: false,
  });
  assert.equal(response.studentFeedback, undefined);
});

test("student can see explicitly published approved feedback", () => {
  const response = sanitizeForStudent({
    studentFeedback: "Please strengthen the literature review.",
    studentFeedbackPublished: true,
  });
  assert.equal(
    response.studentFeedback,
    "Please strengthen the literature review.",
  );
});

test("public result contains no evaluator or internal calculation data", () => {
  const response = sanitizeForPublicResult({
    _id: "thesis-1",
    title: "Secure Research",
    finalMark: 82,
    finalMarkStatus: "published",
    resultPublishedAt: new Date("2026-01-01"),
    supervisor: { name: "Faculty Member", department: "CSE" },
    evaluatorAssignments: [assignment(1, "u1", 85)],
    bestTwoMarks: [85, 79],
  });
  assert.equal(response.finalMark, 82);
  assert.equal(response.evaluatorAssignments, undefined);
  assert.equal(response.bestTwoMarks, undefined);
});
