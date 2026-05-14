const User = require("../models/User");
const Thesis = require("../models/Thesis");

const cleanupInactiveUsers = async () => {
  try {
    const now = new Date();

    const users = await User.find({
      status: { $in: ["pending", "disabled"] },
      isActive: false,
      deleteAfter: { $lte: now },
    });

    if (!users.length) {
      console.log("No inactive accounts to clean.");
      return;
    }

    for (const user of users) {
      if (user.role === "student") {
        await Thesis.deleteMany({ student: user._id });
      }

      await User.findByIdAndDelete(user._id);
    }

    console.log(`${users.length} inactive account(s) deleted.`);
  } catch (err) {
    console.error("Inactive account cleanup failed:", err.message);
  }
};

module.exports = cleanupInactiveUsers;