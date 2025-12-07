import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { CommitMessageStorageInterface } from "../../application/interfaces/commit-message-storage.interface.ts";
import { CommitMessage } from "../../domain/commit-message.js";

export class CommitMessageStorage implements CommitMessageStorageInterface {
  constructor(private readonly commitMessageFilePath: string) {
    if (!commitMessageFilePath) {
      const rootDir = execSync("git rev-parse --show-toplevel", {
        encoding: "utf8",
      });
      this.commitMessageFilePath = path.resolve(
        rootDir,
        ".git",
        "COMMIT_EDITMSG",
      );
    }
  }

  read(): CommitMessage {
    const str = readFileSync(this.commitMessageFilePath, "utf8");
    return CommitMessage.fromCommitMessageStr(str);
  }

  save(newCommitMessage: CommitMessage): void {
    writeFileSync(
      this.commitMessageFilePath,
      newCommitMessage.toCommitMessageStr(),
      "utf8",
    );
  }
}
