import { execSync } from "child_process";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { CommitMsgFileInterface } from "../application/interfaces/commit-msg-file.interface.ts";

export class FsCommitMsgFile implements CommitMsgFileInterface {
  private getDefaultCommitMsgFilePath(): string {
    const rootDir = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    });
    return path.resolve(rootDir, ".git", "COMMIT_EDITMSG");
  }

  async read(filePath?: string): Promise<string> {
    if (!filePath || !existsSync(filePath)) {
      filePath = this.getDefaultCommitMsgFilePath();
    }
    const rawMessage = await readFile(filePath, "utf8");
    return rawMessage;
  }

  async write(message: string, filePath?: string): Promise<void> {
    if (!filePath || !existsSync(filePath)) {
      filePath = this.getDefaultCommitMsgFilePath();
    }
    await writeFile(filePath, message, "utf8");
  }
}
