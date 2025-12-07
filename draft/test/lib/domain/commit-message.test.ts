import assert from "node:assert";
import { describe, it } from "node:test";
import { CommitMessage } from "../../../src/lib/domain/commit-message.ts";

describe("Domain: Commit message value-object", () => {
  it("should init correct", () => {
    const commitMessage = new CommitMessage(
      undefined,
      "feat",
      "app1, app2",
      false,
      "a new feature",
      undefined,
    );

    assert.partialDeepStrictEqual(commitMessage, {
      emoji: undefined,
      type: "feat",
      scope: "app1,app2",
      description: "a new feature",
      hasBreakingChangeMark: false,
      bodyAndFooter: undefined,
    });
  });

  it("should create from str", () => {
    const commitMessage = CommitMessage.fromCommitMessageStr(
      "featapp1, app2: a new feature",
    );

    assert.ok(commitMessage instanceof CommitMessage);
  });

  it("should throw error if no type or description provided", () => {
    assert.throws(
      () => {
        CommitMessage.fromCommitMessageStr("app1, app2: ");
      },
      { message: /Invalid commit message format/ },
    );
  });

  it('should return "feat: a new feature"', () => {
    const commitMessage = new CommitMessage(
      undefined,
      "feat",
      undefined,
      false,
      "a new feature",
      undefined,
    );
    const str = commitMessage.toCommitMessageStr();

    assert.strictEqual(commitMessage.toString(), str);
    assert.strictEqual(str, "feat: a new feature");
  });

  it('should return "✨ feat(app1,app2)!: a new breaking feature"', () => {
    const commitMessage = new CommitMessage(
      "✨",
      "feat",
      "app1, app2",
      true,
      "a new breaking feature",
      undefined,
    );
    const str = commitMessage.toCommitMessageStr();

    assert.strictEqual(commitMessage.toString(), str);
    assert.strictEqual(str, "✨ feat(app1,app2)!: a new breaking feature");
  });

  it("should update the emoji", () => {
    const commitMessage = new CommitMessage(
      undefined,
      "feat",
      "app1, app2",
      false,
      "a new feature",
      undefined,
    );
    const newCommitMessage = commitMessage.setEmoji("✨");

    assert.strictEqual(commitMessage.emoji, undefined);
    assert.strictEqual(newCommitMessage.emoji, "✨");
  });

  it("should update the scope", () => {
    const commitMessage = new CommitMessage(
      undefined,
      "feat",
      "app1, app2",
      false,
      "a new feature",
      undefined,
    );
    const newCommitMessage = commitMessage.setScope("lib1,lib2");

    assert.strictEqual(commitMessage.scope, "app1,app2");
    assert.strictEqual(newCommitMessage.scope, "lib1,lib2");
  });

  it("should append the scope names", () => {
    const commitMessage = new CommitMessage(
      undefined,
      "feat",
      "app1, app2",
      false,
      "a new feature",
      undefined,
    );
    const newCommitMessage = commitMessage.appendScopeNames("app3", "app4");

    assert.throws(() => {
      commitMessage.appendScopeNames();
    });

    assert.strictEqual(commitMessage.scope, "app1,app2");
    assert.strictEqual(newCommitMessage.scope, "(app1,app2,app3,app4)");
  });

  it("should return scope list", () => {
    const commitMessage1 = new CommitMessage(
      undefined,
      "feat",
      "app1, app2",
      false,
      "a new feature",
      undefined,
    );

    const commitMessage2 = new CommitMessage(
      undefined,
      "feat",
      undefined,
      false,
      "a new feature",
      undefined,
    );

    assert.deepStrictEqual(commitMessage1.getScopeList(), ["app1", "app2"]);
    assert.deepStrictEqual(commitMessage2.getScopeList(), undefined);
  });
});
