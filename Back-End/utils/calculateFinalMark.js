// //Mark Calculation Logic
// module.exports = (m1, m2, m3 = null) => {
//   const diff = Math.abs(m1 - m2);

//   if (diff <= 14) {
//     return Math.max(m1, m2);
//   }

//   return Math.max(m1, m2) + m3;
// };

// //Evaluator Marking
// exports.giveMark = async (req, res) => {
//   const Thesis = require("../models/Thesis");

//   const { thesisId, mark } = req.body;

//   const thesis = await Thesis.findById(thesisId);

//   thesis.evaluatorMarks.push({
//     evaluator: req.user._id,
//     mark,
//   });

//   if (thesis.evaluatorMarks.length === 2) {
//     const m1 = thesis.evaluatorMarks[0].mark;
//     const m2 = thesis.evaluatorMarks[1].mark;

//     if (Math.abs(m1 - m2) <= 14) {
//       thesis.finalMark = Math.max(m1, m2);
//     }
//   }

//   await thesis.save();

//   res.json(thesis);
// };


module.exports = (marks)=>{

 if(marks.length===2){

  const m1 = marks[0].mark
  const m2 = marks[1].mark

  const diff = Math.abs(m1-m2)

  if(diff<=14){
   return Math.max(m1,m2)
  }

  return null

 }

 if(marks.length===3){

  const m1 = marks[0].mark
  const m2 = marks[1].mark
  const m3 = marks[2].mark

  return Math.max(m1,m2)+m3

 }

 return null

}