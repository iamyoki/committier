import type { CommitFileInfo } from "../../domain/commit.ts";
import type { CommitRepositoryInterface } from "../../domain/interfaces/commit.repository.interface.ts";

export class GetCommitFilesUseCase {
  constructor(private readonly commitRepository: CommitRepositoryInterface) {}

  async execute(
    filter?: Partial<{
      commitable: boolean;
      addable: boolean;
    }>,
  ): Promise<CommitFileInfo[]> {
    const commit = this.commitRepository.get();
    if (!commit) throw new Error("Nothing to add");

    if (filter?.addable) {
      return commit.getAddableFiles();
    } else if (filter?.commitable) {
      return commit.getCommitableFiles();
    } else {
      return commit.getAllCommitFiles();
    }
  }
}
