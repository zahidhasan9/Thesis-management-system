const test = require("node:test");
const assert = require("node:assert/strict");
const { gradeFromMark } = require("../utils/grade");

test("grade boundaries follow the approved scale", () => {
  assert.equal(gradeFromMark(80), "A+");
  assert.equal(gradeFromMark(75), "A");
  assert.equal(gradeFromMark(70), "A-");
  assert.equal(gradeFromMark(65), "B+");
  assert.equal(gradeFromMark(60), "B");
  assert.equal(gradeFromMark(55), "B-");
  assert.equal(gradeFromMark(50), "C+");
  assert.equal(gradeFromMark(45), "C");
  assert.equal(gradeFromMark(40), "D");
  assert.equal(gradeFromMark(39.99), "F");
});

test("invalid marks do not produce a grade", () => {
  assert.equal(gradeFromMark(undefined), null);
  assert.equal(gradeFromMark("not-a-mark"), null);
});
