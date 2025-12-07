import { CommitMessage } from "../../domain/commit-message.ts";
import type { CommitRepositoryInterface } from "../../domain/interfaces/commit.repository.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";

export class CommitUseCase {
  constructor(
    private readonly commitRepository: CommitRepositoryInterface,
    private readonly git: GitInterface,
  ) {}

  async execute(
    commitMessageStr: string,
    inferPackageNameAsScope: boolean = false,
  ) {
    const commit = this.commitRepository.get();
    if (!commit) throw new Error("Nothing to commit");

    const commitMessage = CommitMessage.fromCommitMessageStr(commitMessageStr);
    const commitableFiles = commit.getCommitableFiles();

    await this.git.commit(commitMessage, commitableFiles);

    return commit.commit(commitMessage, inferPackageNameAsScope);
  }
}
