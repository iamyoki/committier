import { readPackageUp } from "read-package-up";
import { simpleGit } from "simple-git";
import { CommitFile } from "../domain/commit-file.ts";
import type { CommitFileRepositoryInterface } from "../domain/interfaces/commit-file.repository.interface.ts";

export class GitCommitFileRepository implements CommitFileRepositoryInterface {
  private readonly git = simpleGit();

  constructor(private readonly readPackageName: boolean) {}

  async findAll(): Promise<CommitFile[]> {
    const status = await this.git.status();
    const commitFiles: CommitFile[] = [];

    for (const f of status.files) {
      let packageName: string | undefined;
      if (this.readPackageName) {
        const res = await readPackageUp({ cwd: f.path });
        packageName = res?.packageJson.name;
      }
      const commitable = f.index !== " " && f.index !== "?";
      const addable = f.working_dir !== " ";

      const commitFile = CommitFile.create(
        f.path,
        packageName,
        commitable,
        addable,
      );
      commitFiles.push(commitFile);
    }

    return commitFiles;
  }

  async findAddables(): Promise<CommitFile[]> {
    const files = await this.findAll();
    return files.filter((f) => f.addable);
  }

  async findCommitables(): Promise<CommitFile[]> {
    const files = await this.findAll();
    return files.filter((f) => f.commitable);
  }
}
