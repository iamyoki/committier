import type { CommitMessage } from "../../domain/commit-message.ts";
import type { CommitFileInfo } from "../../domain/commit.ts";

export interface GitInterface {
  getFiles(readPacakgeName: boolean): Promise<CommitFileInfo[]>;
  add(fileInfos: CommitFileInfo[]): Promise<void>;
  commit(
    commitMessage: CommitMessage,
    fileInfos: CommitFileInfo[],
  ): Promise<void>;
}
