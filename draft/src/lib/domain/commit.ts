import type { UUID } from "node:crypto";
import { CommitFile } from "./commit-file.js";
import { CommitMessage } from "./commit-message.js";

export type CommitFileInfo = {
  filePath: string;
  fileName: string;
  packageName?: string | undefined;
  commitable?: boolean;
  addable?: boolean;
};

export type CommitResult = {
  fileInfos: CommitFileInfo[];
  commitMessage: CommitMessage;
};

export class Commit {
  constructor(
    public readonly id: UUID,
    private commitFiles: CommitFile[],
  ) {}

  static create(fileInfos: CommitFileInfo[]) {
    const id = crypto.randomUUID();
    return new Commit(
      id,
      fileInfos.map((info) =>
        CommitFile.create(
          info.filePath,
          info.fileName,
          info.packageName,
          !!info.commitable,
          !!info.addable,
        ),
      ),
    );
  }

  getAllCommitFiles(): CommitFileInfo[] {
    return this.commitFiles.map((f) => ({
      filePath: f.filePath,
      fileName: f.fileName,
      packageName: f.packageName,
      commitable: f.commitable,
      addable: f.addable,
    }));
  }

  getCommitableFiles(): CommitFileInfo[] {
    return this.commitFiles
      .filter((f) => f.commitable)
      .map((f) => ({
        filePath: f.filePath,
        fileName: f.fileName,
        packageName: f.packageName,
        commitable: f.commitable,
        addable: f.addable,
      }));
  }

  getAddableFiles(): CommitFileInfo[] {
    return this.commitFiles
      .filter((f) => f.addable)
      .map((f) => ({
        filePath: f.filePath,
        fileName: f.fileName,
        packageName: f.packageName,
        commitable: f.commitable,
        addable: f.addable,
      }));
  }

  private getCommitablePackageNames(): string[] {
    return Array.from(
      new Set(
        this.getCommitableFiles()
          .filter((f) => !!f.packageName)
          .map((f) => f.packageName as string),
      ),
    );
  }

  add(filePaths: string[]): void {
    filePaths.forEach((filePath) => {
      const commitFile = this.commitFiles.find(
        (commitFile) => commitFile.filePath === filePath,
      );
      if (commitFile?.addable) {
        commitFile.add();
      }
    });
  }

  commit(
    commitMessage: CommitMessage,
    inferPackageNameAsScope: boolean = false,
  ): CommitResult {
    const commitableFiles = this.commitFiles.filter(
      (commitFile) => commitFile.commitable,
    );

    commitableFiles.forEach((commitFile) => {
      commitFile.commit();
    });

    const packageNames = this.getCommitablePackageNames();

    if (inferPackageNameAsScope && !commitMessage.scope) {
      const newCommitMessage =
        commitMessage.setPackageNamesAsScope(packageNames);
      commitMessage = newCommitMessage;
    }

    return {
      fileInfos: commitableFiles.map((f) => ({
        filePath: f.filePath,
        fileName: f.fileName,
        packageName: f.packageName,
        commitable: f.commitable,
        addable: f.addable,
      })),
      commitMessage,
    };
  }
}
