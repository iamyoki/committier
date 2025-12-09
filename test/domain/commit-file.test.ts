import assert from "node:assert";
import { describe, it } from "node:test";
import { CommitFile } from "../../src/domain/commit-file.ts";

describe("commit file entity", () => {
  it("create a commit file instance", () => {
    const commitFile = CommitFile.create("a/b.js", "foo", true, false);
    assert.ok(commitFile instanceof CommitFile);
  });

  it("have correct properties", () => {
    const commitFile = CommitFile.create("a/b.js", "@foo/bar", true, false);
    assert.strictEqual(commitFile.fileName, "b.js");
    assert.strictEqual(commitFile.fileBaseName, "b");
    assert.strictEqual(commitFile.packageNameWithoutScope, "bar");
  });
});
