const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") return cb(null, true);
  return cb(new Error("Only PDF files are allowed"), false);
};

// Files are kept in memory briefly, then the controller saves them according
// to FILE_STORAGE (local disk or Cloudinary).
module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});
