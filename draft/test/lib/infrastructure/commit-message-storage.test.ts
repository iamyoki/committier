import assert from "node:assert";
import { readFileSync, writeFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as tmp from "tmp";
import { CommitMessage } from "../../../src/lib/domain/commit-message.ts";
import { CommitMessageStorage } from "../../../src/lib/index.ts";

tmp.setGracefulCleanup();

describe("Infra: Commit message storage", () => {
  it("read from fs and return commitMessage instance", async () => {
    // prepare a temp file
    const tempfile = tmp.fileSync();
    writeFileSync(tempfile.name, "feat: a new feature", "utf8");

    const commitMessageStorage = new CommitMessageStorage(tempfile.name);
    const commitMessage = commitMessageStorage.read();

    assert.ok(commitMessage instanceof CommitMessage);
  });

  it("write into fs", async () => {
    // prepare a temp file
    const tempfile = tmp.fileSync();

    const commitMessageStorage = new CommitMessageStorage(tempfile.name);
    commitMessageStorage.save(
      CommitMessage.fromCommitMessageStr("feat: a new feature"),
    );

    const str = readFileSync(tempfile.name, "utf8");

    assert.strictEqual(str, "feat: a new feature");
  });
});
