const gradeFromMark = (mark) => {
  const value = Number(mark);
  if (!Number.isFinite(value)) return null;
  if (value >= 80) return "A+";
  if (value >= 75) return "A";
  if (value >= 70) return "A-";
  if (value >= 65) return "B+";
  if (value >= 60) return "B";
  if (value >= 55) return "B-";
  if (value >= 50) return "C+";
  if (value >= 45) return "C";
  if (value >= 40) return "D";
  return "F";
};

module.exports = { gradeFromMark };
