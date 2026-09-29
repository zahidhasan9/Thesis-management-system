const multer = require("multer");

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!allowedTypes.has(file.mimetype)) return callback(new Error("Only JPG, PNG, or WebP images are allowed"));
    return callback(null, true);
  },
});

const uploadProfileImage = (req, res, next) => {
  upload.single("profileImage")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Profile image must be 2MB or smaller" });
    return res.status(400).json({ message: error.message || "Invalid profile image" });
  });
};

module.exports = { uploadProfileImage };
