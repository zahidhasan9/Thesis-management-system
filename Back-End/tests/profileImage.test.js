const test = require("node:test");
const assert = require("node:assert/strict");
const { hasValidSignature } = require("../controllers/profileController");

test("profile image signatures accept JPEG, PNG, and WebP", () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const webp = Buffer.from("RIFF0000WEBP", "ascii");
  assert.equal(hasValidSignature(jpeg), true);
  assert.equal(hasValidSignature(png), true);
  assert.equal(hasValidSignature(webp), true);
});

test("profile image signatures reject disguised or incomplete files", () => {
  assert.equal(hasValidSignature(Buffer.from("not an image", "ascii")), false);
  assert.equal(hasValidSignature(Buffer.from([0xff, 0xd8])), false);
});
