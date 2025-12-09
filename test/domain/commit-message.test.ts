import assert from "node:assert";
import { describe, it } from "node:test";
import { CommitMessage } from "../../src/domain/commit-message.ts";

describe("commit message vo", () => {
  it("create a commit message value-object", () => {
    const commitMessage = CommitMessage.create("feat: a new feature");
    assert.ok(commitMessage instanceof CommitMessage);
  });

  it("return correct commit message string", () => {
    const commitMessage = CommitMessage.create(
      "feat: a new feature",
      ["This feature is awesome"],
      ["Close #123"],
    );
    const str = commitMessage.toString();
    assert.strictEqual(
      str,
      "feat: a new feature\n\nThis feature is awesome\n\nClose #123",
    );
  });
});
