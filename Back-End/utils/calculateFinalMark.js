


// module.exports = (thesis) => {

//  const marks = thesis.evaluatorMarks

//  if(marks.length < 2) return null

//  const m1 = marks[0].mark
//  const m2 = marks[1].mark

//  const diff = Math.abs(m1 - m2)

//  // difference <=14, final = max of first two
//  if(diff <= 14){
//   return Math.max(m1, m2)
//  }

//  // difference >14, final mark depends on third evaluator
//  if(thesis.thirdEvaluatorMark){
//   const third = thesis.thirdEvaluatorMark.mark
//   const topTwo = [m1, m2, third].sort((a,b)=>b-a)
//   return (topTwo[0] + topTwo[1]) / 2
//  }

//  return null
// }

module.exports = (thesis) => {
  const marks = thesis.evaluatorMarks;

  // Minimum 2 marks lagbe first two evaluators theke
  if (marks.length < 2) return null;

  const m1 = marks[0].mark;
  const m2 = marks[1].mark;

  const diff = Math.abs(m1 - m2);

  // 1 Difference ≤14 → final mark = max of first two
  if (diff <= 14) {
    return Math.max(m1, m2);
  }

  // 2 Difference >14 → check third evaluator
  if (thesis.thirdEvaluatorMark) {
    // Third evaluator mark submit hole final mark = third evaluator mark
    return thesis.thirdEvaluatorMark.mark;
  }

  //3 Difference >14 but third evaluator mark nai → final mark pending
  return null;
};