// const Thesis = require("../models/Thesis")
// const calculate = require("../utils/calculateFinalMark")

// // exports.getAccepted = async(req,res)=>{

// //  const thesis = await Thesis.find({
// //   status:"accepted"
// //  }).populate("student")

// //  res.json(thesis)

// // }

// exports.giveMark = async(req,res)=>{

//  const {thesisId,mark} = req.body

//  const thesis = await Thesis.findById(thesisId)

//  thesis.evaluatorMarks.push({
//   evaluator:req.user._id,
//   mark
//  })

//  const result = calculate(thesis.evaluatorMarks)

//  thesis.finalMark = result

//  await thesis.save()

//  res.json(thesis)

// }

// exports.submitMark = async (req, res) => {
//  try{
//    const { thesisId, mark } = req.body
//    const thesis = await Thesis.findById(thesisId)

//    if(!thesis) return res.status(404).json({message:"Thesis not found"})

//    // Check if user already submitted first two marks
//    if(thesis.evaluatorMarks.find(m => m.evaluator.toString() === req.user._id.toString())){
//      return res.status(400).json({message:"You already submitted your mark"})
//    }

//    // Max two marks rule for first two evaluators
//    if(thesis.evaluatorMarks.length >= 2){
//      return res.status(400).json({message:"First two evaluators already submitted"})
//    }

//    thesis.evaluatorMarks.push({ evaluator:req.user._id, mark })

//    // calculate final mark
//    thesis.finalMark = calculate(thesis)

//    await thesis.save()

//    res.json({ message:"Mark submitted", thesis })

//  }catch(err){
//    res.status(500).json({message: err.message})
//  }
// }


// exports.submitThirdEvaluatorMark = async (req,res) => {
//  try{
//    const { thesisId, mark } = req.body
//    const thesis = await Thesis.findById(thesisId)

//    if(!thesis) return res.status(404).json({message:"Thesis not found"})

//    if(thesis.evaluatorMarks.length !== 2){
//      return res.status(400).json({message:"Third evaluator not needed yet"})
//    }

//    const diff = Math.abs(thesis.evaluatorMarks[0].mark - thesis.evaluatorMarks[1].mark)
//    if(diff <= 14){
//      return res.status(400).json({message:"Difference <=14, third evaluator not required"})
//    }

//    if(thesis.thirdEvaluatorMark){
//      return res.status(400).json({message:"Third evaluator already submitted"})
//    }

//    thesis.thirdEvaluatorMark = { evaluator:req.user._id, mark }
//    thesis.finalMark = calculate(thesis)

//    await thesis.save()

//    res.json({message:"Third evaluator mark submitted", thesis})

//  }catch(err){
//    res.status(500).json({message:err.message})
//  }
// }



// /// Get pending theses for third evaluator
// exports.getPendingThirdEvaluator = async (req,res) => {
//  try{
//    const theses = await Thesis.find({
//      evaluatorMarks: { $size: 2 },
//      thirdEvaluatorMark: null
//    }).populate("student").lean()

//    const pending = theses.filter(th => {
//      const diff = Math.abs(th.evaluatorMarks[0].mark - th.evaluatorMarks[1].mark)
//      return diff > 14
//    })

//    res.json(pending)

//  }catch(err){
//    res.status(500).json({message:err.message})
//  }
// }

// // Get all accepted theses
// exports.getAccepted = async(req,res)=>{
//  try{
//    const thesis = await Thesis.find({status:"accepted"}).populate("student")
//    res.json(thesis)
//  }catch(err){
//    res.status(500).json({message:err.message})
//  }
// }




const Thesis = require("../models/Thesis");
const User = require("../models/User");
const calculate = require("../utils/calculateFinalMark");

// Get all accepted theses
exports.getAccepted = async (req, res) => {
  try {
    const theses = await Thesis.find({
      status: { $in: ["accepted", "completed"] },
    }).populate("student");

    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Submit first/second evaluator mark
exports.submitMark = async (req, res) => {
  try {
    const { thesisId, mark } = req.body;
    const thesis = await Thesis.findById(thesisId);

    if (!thesis) return res.status(404).json({ message: "Thesis not found" });

    // Check if evaluator already submitted
    if (thesis.evaluatorMarks.find(m => m.evaluator.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: "You already submitted your mark" });
    }

    // Max 2 evaluators rule
    if (thesis.evaluatorMarks.length >= 2) {
      return res.status(400).json({ message: "First two evaluators already submitted" });
    }

    // Push evaluator mark
    thesis.evaluatorMarks.push({ evaluator: req.user._id, mark });

    // Calculate final mark
    thesis.finalMark = calculate(thesis);

     // If final mark is ready, mark thesis as completed
    if (thesis.finalMark != null) {
      thesis.status = "completed";
    }

    await thesis.save();
    res.json({ message: "Mark submitted", thesis });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit third evaluator mark
exports.submitThirdEvaluatorMark = async (req, res) => {
  try {
    const { thesisId, mark } = req.body;

    if (mark == null) {
      return res.status(400).json({ message: "Mark is required" });
    }

    const thesis = await Thesis.findById(thesisId);

    if (!thesis) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    // Ensure first 2 evaluators have submitted
    if (thesis.evaluatorMarks.length !== 2) {
      return res
        .status(400)
        .json({ message: "Third evaluator not needed yet" });
    }

    // Check difference between first two evaluators
    const diff = Math.abs(
      thesis.evaluatorMarks[0].mark - thesis.evaluatorMarks[1].mark
    );

    if (diff <= 14) {
      return res
        .status(400)
        .json({ message: "Difference ≤14, third evaluator not required" });
    }

    // Prevent duplicate submission
    if (thesis.thirdEvaluatorMark?.mark != null) {
      return res
        .status(400)
        .json({ message: "Third evaluator already submitted" });
    }

    // Set third evaluator mark
    thesis.thirdEvaluatorMark = { evaluator: req.user._id, mark };

    // Final mark = third evaluator mark (per rule)
    thesis.finalMark = calculate(thesis);

    // Mark thesis as completed
    if (thesis.finalMark != null) {
      thesis.status = "completed";
    }

    await thesis.save();

    res.json({ message: "Third evaluator mark submitted", thesis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Get pending theses for third evaluator
exports.getPendingThirdEvaluator = async (req, res) => {
  try {
    const theses = await Thesis.find({
      evaluatorMarks: { $size: 2 },
      // thirdEvaluatorMark: null
    }).populate("student").lean();

    const pending = theses.filter(th => {
      const diff = Math.abs(th.evaluatorMarks[0].mark - th.evaluatorMarks[1].mark);
      return diff > 14;
    });

    res.json(pending);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getThesisById = async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id).populate("student");

    if (!thesis) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    res.json(thesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getEvaluatorProfile = async (req, res) => {
  try {
    const evaluator = await User.findById(req.user.id).select("-password");
    res.json(evaluator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvaluatorProfile = async (req, res) => {
  try {
    const { name, phone, department, designation, note } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, designation, note },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};