const DEFAULT_THRESHOLD = Number(process.env.THIRD_EVALUATOR_THRESHOLD || 14);

const validSubmittedAssignments = (thesis) =>
  (thesis.evaluatorAssignments || []).filter(
    (item) =>
      ["mark_submitted", "completed"].includes(item.status) &&
      Number.isFinite(item.mark) &&
      item.mark >= 0 &&
      item.mark <= 100,
  );

const getEvaluationState = (thesis) => {
  const assignments = thesis.evaluatorAssignments || [];
  const first = assignments.find((item) => item.position === 1);
  const second = assignments.find((item) => item.position === 2);
  const third = assignments.find((item) => item.position === 3);
  const configuredThreshold =
    process.env.THIRD_EVALUATOR_THRESHOLD === undefined
      ? null
      : Number(process.env.THIRD_EVALUATOR_THRESHOLD);
  const threshold =
    Number.isFinite(configuredThreshold) && configuredThreshold >= 0
      ? configuredThreshold
      : Number.isFinite(thesis.evaluationThreshold)
        ? thesis.evaluationThreshold
        : DEFAULT_THRESHOLD;
  const firstTwoReady =
    Number.isFinite(first?.mark) &&
    Number.isFinite(second?.mark) &&
    ["mark_submitted", "completed"].includes(first.status) &&
    ["mark_submitted", "completed"].includes(second.status);
  const difference = firstTwoReady
    ? Math.abs(Number(first.mark) - Number(second.mark))
    : null;
  const automaticallyRequired =
    difference !== null && difference > threshold;
  const thirdRequired =
    Boolean(thesis.thirdEvaluatorRequired) || automaticallyRequired;
  const thirdReady =
    Number.isFinite(third?.mark) &&
    ["mark_submitted", "completed"].includes(third?.status);

  return {
    threshold,
    first,
    second,
    third,
    firstTwoReady,
    difference,
    automaticallyRequired,
    thirdRequired,
    thirdReady,
  };
};

const calculateFinalMark = (thesis) => {
  const state = getEvaluationState(thesis);
  if (!state.firstTwoReady || (state.thirdRequired && !state.thirdReady)) {
    return {
      finalMark: null,
      bestTwoMarks: [],
      ...state,
    };
  }

  const validMarks = validSubmittedAssignments(thesis).map((item) =>
    Number(item.mark),
  );
  if (validMarks.length < 2) {
    return { finalMark: null, bestTwoMarks: [], ...state };
  }

  const bestTwoMarks = [...validMarks].sort((a, b) => b - a).slice(0, 2);
  const finalMark = Number(
    ((bestTwoMarks[0] + bestTwoMarks[1]) / 2).toFixed(2),
  );

  return { finalMark, bestTwoMarks, ...state };
};

const applyEvaluationCalculation = (thesis) => {
  const result = calculateFinalMark(thesis);
  thesis.evaluationThreshold = result.threshold;

  if (
    result.automaticallyRequired &&
    !thesis.thirdEvaluatorRequired
  ) {
    thesis.thirdEvaluatorRequired = true;
    thesis.thirdEvaluatorRequirementType = "automatic";
    thesis.thirdEvaluatorRequirementReason =
      `First and Second Evaluator marks differ by ${result.difference}, exceeding the ${result.threshold} mark threshold.`;
    thesis.thirdEvaluatorRequiredAt = new Date();
  }

  thesis.finalMark = result.finalMark ?? undefined;
  thesis.bestTwoMarks = result.bestTwoMarks;
  thesis.finalMarkCalculatedAt = result.finalMark == null ? undefined : new Date();
  thesis.finalMarkStatus = result.finalMark == null ? "pending" : "calculated";
  thesis.resultPublished = false;
  thesis.resultPublishedAt = undefined;
  thesis.resultPublishedBy = undefined;

  return result;
};

module.exports = {
  DEFAULT_THRESHOLD,
  getEvaluationState,
  calculateFinalMark,
  applyEvaluationCalculation,
};
