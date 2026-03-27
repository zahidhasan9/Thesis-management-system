const User = require("../models/User")
const Thesis = require("../models/Thesis")

exports.getUsers = async(req,res)=>{

 const users = await User.find()

 res.json(users)

}

// PATCH /admin/users/:id
exports.changeRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (role === "evaluator") {
    const count = await User.countDocuments({ role: "evaluator" });
    if (count >= 2) {
      return res.status(400).json({ message: "Only 3 evaluators allowed" });
    }
  }

  if (role === "third_evaluator") {
    const count = await User.countDocuments({ role: "third_evaluator" });
    if (count >= 1) {
      return res.status(400).json({ message: "Only 1 third_evaluator allowed" });
    }
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.getDashboardStats = async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" })
  const pending = await Thesis.countDocuments({ status: "pending" })
  const completed = await Thesis.countDocuments({ status: "completed" })

  res.json({ totalStudents, pending, completed })
}



// Pending Thesis
exports.getPendingThesis = async (req, res) => {
  try {
   
    const pending = await Thesis.find({ status: "pending" })
      .populate("student", "name email"); // student info add

    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Chart Data
exports.getChartData = async (req, res) => {
  try {
    
    const result = await Thesis.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // aggregate data 
    const chartData = result.map((r) => ({
      month: r._id, // 1-12
      count: r.count,
    }));

    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Admin cannot delete themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If student, delete their thesis
    if (user.role === "student") {
      await Thesis.deleteMany({ student: user._id });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all thesis
exports.getAllThesis = async (req, res) => {
  try {
    const thesis = await Thesis.find()
      .populate("student")
    //   .populate("supervisor", "name email")
      .populate({path:"thirdEvaluatorMark.evaluator"})
      .populate({path: "evaluatorMarks.evaluator"});
    res.json(thesis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single thesis
exports.getSingleThesis = async (req, res) => {
  const thesis = await Thesis.findById(req.params.id)
    .populate("student")
    .populate("supervisor", "name email")
    .populate("thirdEvaluatorMark.evaluator")
    .populate("evaluatorMarks.evaluator");

  res.json(thesis);
};

// Delete a thesis
exports.deleteThesis = async (req, res) => {
  try {
    const { id } = req.params;
    const thesis = await Thesis.findByIdAndDelete(id);
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });

    res.json({ message: "Thesis deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};