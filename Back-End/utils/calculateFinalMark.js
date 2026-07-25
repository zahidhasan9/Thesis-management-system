const { calculateFinalMark } = require("../services/evaluationService");

module.exports = (thesis) => calculateFinalMark(thesis).finalMark;
