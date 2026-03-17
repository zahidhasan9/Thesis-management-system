const Thesis = require("../models/Thesis")
const User = require("../models/User")


exports.getAllThesis = async(req,res)=>{

 try{

  const thesis = await Thesis.find()
  .populate("student")

  res.json(thesis)

 }catch(err){
 console.error(err)
  res.status(500).json({message:"Server error"})

 }

}
exports.reviewThesis = async(req,res)=>{

 const {thesisId,status,note} = req.body
 const thesis = await Thesis.findByIdAndUpdate(

  thesisId,
 
  {
   status,
   supervisorNote:note,
   supervisor:req.user._id,
  },

  {new:true}

 )

 res.json(thesis)

}


exports.assignEvaluators = async(req,res)=>{

 const {thesisId,evaluators} = req.body

 const thesis = await Thesis.findById(thesisId)

 thesis.evaluators = evaluators

 await thesis.save()

 res.json({
  message:"Evaluators assigned",
  thesis
 })

}


exports.getSingleThesis = async (req, res) => {
  try {
    const { id } = req.params;

    const thesis = await Thesis.findById(id)
      .populate("student", "name email")
    //   .populate("supervisor", "name email");

    if (!thesis) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    res.json(thesis);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getProfile = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id).select("-password");
    if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

    res.json(supervisor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/supervisor/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, department, phone, bio } = req.body;

    const supervisor = await User.findById(req.user.id);
    if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

    supervisor.name = name || supervisor.name;
    supervisor.email = email || supervisor.email;
    supervisor.department = department || supervisor.department;
    supervisor.phone = phone || supervisor.phone;
    supervisor.bio = bio || supervisor.bio;

    await supervisor.save();

    res.json(supervisor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};