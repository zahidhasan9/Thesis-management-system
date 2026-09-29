const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

const storageProvider = (process.env.FILE_STORAGE || "local").trim().toLowerCase();
const useCloudinary = storageProvider === "cloudinary";

if (useCloudinary) {
  const required = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Cloudinary storage is selected but missing: ${missing.join(", ")}`);
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
}

const safeBaseName = (name) => path.basename(name, path.extname(name)).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "file";

const saveFile = async (file, { folder, resourceType }) => {
  if (!file?.buffer) throw new Error("No upload data received");
  if (!useCloudinary) {
    const targetDirectory = path.join(__dirname, "..", "uploads", folder);
    await fs.promises.mkdir(targetDirectory, { recursive: true });
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName(file.originalname)}${path.extname(file.originalname).toLowerCase()}`;
    await fs.promises.writeFile(path.join(targetDirectory, fileName), file.buffer);
    return { path: `uploads/${folder}/${fileName}`, publicId: null };
  }
  const extension = resourceType === "raw" ? path.extname(file.originalname).toLowerCase() : "";
  const publicId = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName(file.originalname)}${extension}`;
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "thesis-management-system", public_id: publicId, resource_type: resourceType, use_filename: false }, (error, uploadResult) => error ? reject(error) : resolve(uploadResult));
    stream.end(file.buffer);
  });
  return { path: result.secure_url, publicId: result.public_id };
};

const removeFile = async ({ filePath, publicId, resourceType = "raw" } = {}) => {
  if (useCloudinary) {
    if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
    return;
  }
  if (!filePath || /^https?:\/\//i.test(filePath)) return;
  const uploadsRoot = path.resolve(__dirname, "..", "uploads") + path.sep;
  const absolutePath = path.resolve(__dirname, "..", filePath);
  if (absolutePath.startsWith(uploadsRoot)) await fs.promises.unlink(absolutePath).catch(() => undefined);
};

module.exports = { saveFile, removeFile, storageProvider };
