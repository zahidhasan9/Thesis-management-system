require("dotenv").config();
const mongoose = require("mongoose");
const Thesis = require("../models/Thesis");
const { applyEvaluationCalculation } = require("../services/evaluationService");

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let updated = 0;
  const cursor = Thesis.find().cursor();

  for await (const thesis of cursor) {
    let changed = false;
    if (!thesis.evaluatorAssignments.length && thesis.evaluatorMarks?.length) {
      thesis.evaluatorAssignments = thesis.evaluatorMarks.map((item, index) => ({
        evaluator: item.evaluator,
        position: index + 1,
        status: Number.isFinite(item.mark) ? "mark_submitted" : "accepted",
        mark: item.mark,
        markLocked: Number.isFinite(item.mark),
        submittedAt: Number.isFinite(item.mark) ? thesis.updatedAt : undefined,
      }));
      if (
        thesis.thirdEvaluatorMark?.evaluator &&
        Number.isFinite(thesis.thirdEvaluatorMark.mark)
      ) {
        thesis.evaluatorAssignments.push({
          evaluator: thesis.thirdEvaluatorMark.evaluator,
          position: 3,
          status: "mark_submitted",
          mark: thesis.thirdEvaluatorMark.mark,
          markLocked: true,
          submittedAt: thesis.updatedAt,
        });
        thesis.thirdEvaluatorRequired = true;
        thesis.thirdEvaluatorRequirementType = "manual";
        thesis.thirdEvaluatorRequirementReason = "Migrated legacy third evaluation";
      }
      changed = true;
    }
    if (
      thesis.supervisor &&
      (!thesis.supervisorRequest ||
        thesis.supervisorRequest.status === "unassigned")
    ) {
      thesis.supervisorRequest = {
        status: thesis.status === "pending" ? "pending" : "accepted",
      };
      changed = true;
    }
    if (!Number.isFinite(thesis.evaluationThreshold)) {
      thesis.evaluationThreshold = Number(
        process.env.THIRD_EVALUATOR_THRESHOLD || 10,
      );
      changed = true;
    }
    if (changed) {
      applyEvaluationCalculation(thesis);
      await thesis.save();
      updated += 1;
    }
  }

  console.log(`Evaluation migration complete. Updated ${updated} thesis records.`);
  await mongoose.disconnect();
};

migrate().catch(async (error) => {
  console.error("Evaluation migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
