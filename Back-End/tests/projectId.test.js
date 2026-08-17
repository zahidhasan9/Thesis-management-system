const test = require("node:test");
const assert = require("node:assert/strict");
const { mock } = require("node:test");
const ProjectCounter = require("../models/ProjectCounter");
const {
  assignProjectId,
  normalizeAcademicSession,
} = require("../services/projectId");

test("academic sessions are normalized for display IDs", () => {
  assert.equal(normalizeAcademicSession("2020-2021"), "20-21");
  assert.equal(normalizeAcademicSession("20/21"), "20-21");
  assert.equal(
    normalizeAcademicSession("", new Date("2026-08-04")),
    "26-27",
  );
});

test("a project ID is allocated and persisted", async (context) => {
  context.mock.method(ProjectCounter, "findOneAndUpdate", async () => ({
    sequence: 15,
  }));
  let persisted;
  const thesis = {
    _id: "thesis-1",
    createdAt: new Date("2021-01-01"),
    constructor: {
      updateOne: async (filter, update) => {
        persisted = { filter, update };
      },
    },
  };

  const projectId = await assignProjectId(thesis, { session: "2020-2021" });

  assert.equal(projectId, "20-21-015");
  assert.equal(thesis.projectId, "20-21-015");
  assert.deepEqual(persisted.filter, { _id: "thesis-1" });
  assert.equal(persisted.update.$set.projectId, "20-21-015");
  mock.reset();
});
