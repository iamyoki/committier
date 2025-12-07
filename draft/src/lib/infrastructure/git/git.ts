import path from "node:path";
import { readPackageUpSync } from "read-package-up";
import { simpleGit } from "simple-git";
import type { GitInterface } from "../../application/interfaces/git.interface.ts";
import type { CommitMessage } from "../../domain/commit-message.ts";
import type { CommitFileInfo } from "../../domain/commit.ts";

export class Git implements GitInterface {
  private readonly git = simpleGit();

  async getFiles(readPacakgeName: boolean): Promise<CommitFileInfo[]> {
    const status = await this.git.status();
    return status.files.map((f) => {
      const fileName = path.basename(f.path);
      const packageName = readPacakgeName
        ? readPackageUpSync({ cwd: f.path })?.packageJson.name
        : undefined;
      const commitable = f.index !== " " && f.index !== "?";
      const addable = f.working_dir !== " ";
      return {
        filePath: f.path,
        fileName,
        packageName,
        commitable,
        addable,
      };
    });
  }

  async add(fileInfos: CommitFileInfo[]): Promise<void> {
    await this.git.add(fileInfos.map((f) => f.filePath));
  }

  async commit(
    commitMessage: CommitMessage,
    fileInfos: CommitFileInfo[],
  ): Promise<void> {
    await this.git.commit(
      commitMessage.toCommitMessageStr(),
      fileInfos.map((f) => f.filePath),
    );
  }
}
