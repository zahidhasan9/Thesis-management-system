const User = require("../models/User");
const { saveFile, removeFile } = require("../services/fileStorage");

const removeManagedImage = async (filePath, publicId) => {
  try {
    await removeFile({ filePath, publicId, resourceType: "image" });
  } catch (error) {
    console.error("Profile image cleanup failed:", error.message);
  }
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
    const signature = req.file.buffer.subarray(0, 12);
    if (!hasValidSignature(signature)) {
      return res.status(400).json({ message: "The uploaded file is not a valid image" });
    }

    const user = await User.findById(req.user._id).select("+profileImagePublicId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousImage = user.profileImage;
    const previousImagePublicId = user.profileImagePublicId;
    const storedFile = await saveFile(req.file, { folder: "profile", resourceType: "image" });
    user.profileImage = storedFile.path;
    user.profileImagePublicId = storedFile.publicId;
    await user.save();
    await removeManagedImage(previousImage, previousImagePublicId);

    const safeUser = await User.findById(user._id).select("-password");
    return res.json({ message: "Profile picture updated", user: safeUser });
  } catch (error) {
    console.error("Profile image upload failed:", error.message);
    return res.status(500).json({ message: "Could not update profile picture" });
  }
};

exports.removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+profileImagePublicId");
    if (!user) return res.status(404).json({ message: "User not found" });
    const previousImage = user.profileImage;
    const previousImagePublicId = user.profileImagePublicId;
    user.profileImage = undefined;
    user.profileImagePublicId = undefined;
    await user.save();
    await removeManagedImage(previousImage, previousImagePublicId);
    const safeUser = await User.findById(user._id).select("-password");
    return res.json({ message: "Profile picture removed", user: safeUser });
  } catch (error) {
    console.error("Profile image removal failed:", error.message);
    return res.status(500).json({ message: "Could not remove profile picture" });
  }
};

exports.hasValidSignature = hasValidSignature;
