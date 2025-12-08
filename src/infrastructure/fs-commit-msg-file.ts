import { execSync } from "child_process";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { CommitMsgFileInterface } from "../application/interfaces/commit-msg-file.interface.ts";

export class FsCommitMsgFile implements CommitMsgFileInterface {
  private filePath: string | undefined;

  private getDefaultCommitMsgFilePath(): string {
    const rootDir = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    });
    return path.resolve(rootDir, ".git", "COMMIT_EDITMSG");
  }

  async read(filePath: string): Promise<string> {
    if (!existsSync(filePath)) {
      filePath = this.getDefaultCommitMsgFilePath();
    }
    const rawMessage = await readFile(filePath, "utf8");
    this.filePath = filePath;
    return rawMessage;
  }

  async write(message: string): Promise<void> {
    if (this.filePath) {
      await writeFile(this.filePath, message, "utf8");
    }
  }
}
