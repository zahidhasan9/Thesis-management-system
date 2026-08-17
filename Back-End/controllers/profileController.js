const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const uploadsRoot = path.resolve(__dirname, "..", "uploads");

const removeManagedImage = async (relativePath) => {
  if (!relativePath) return;
  const absolutePath = path.resolve(__dirname, "..", relativePath);
  const profileRoot = path.join(uploadsRoot, "profile") + path.sep;
  if (!absolutePath.startsWith(profileRoot)) return;
  await fs.promises.unlink(absolutePath).catch((error) => {
    if (error.code !== "ENOENT") console.error("Profile image cleanup failed:", error.message);
  });
};

const hasValidSignature = (buffer) => {
  if (!buffer || buffer.length < 12) return false;
  const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  const webp =
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return jpeg || png || webp;
};

exports.uploadProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Select a profile image" });

  try {
    const signature = await fs.promises.readFile(req.file.path).then((data) => data.subarray(0, 12));
    if (!hasValidSignature(signature)) {
      await fs.promises.unlink(req.file.path).catch(() => undefined);
      return res.status(400).json({ message: "The uploaded file is not a valid image" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      await fs.promises.unlink(req.file.path).catch(() => undefined);
      return res.status(404).json({ message: "User not found" });
    }

    const previousImage = user.profileImage;
    user.profileImage = `uploads/profile/${req.file.filename}`;
    await user.save();
    await removeManagedImage(previousImage);

    const safeUser = await User.findById(user._id).select("-password");
    return res.json({ message: "Profile picture updated", user: safeUser });
  } catch (error) {
    await fs.promises.unlink(req.file.path).catch(() => undefined);
    console.error("Profile image upload failed:", error.message);
    return res.status(500).json({ message: "Could not update profile picture" });
  }
};

exports.removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const previousImage = user.profileImage;
    user.profileImage = undefined;
    await user.save();
    await removeManagedImage(previousImage);
    const safeUser = await User.findById(user._id).select("-password");
    return res.json({ message: "Profile picture removed", user: safeUser });
  } catch (error) {
    console.error("Profile image removal failed:", error.message);
    return res.status(500).json({ message: "Could not remove profile picture" });
  }
};

exports.hasValidSignature = hasValidSignature;
