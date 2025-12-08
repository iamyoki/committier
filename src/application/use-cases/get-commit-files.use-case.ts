import type { CommitFile } from "../../domain/commit-file.ts";
import type { CommitFileRepositoryInterface } from "../../domain/interfaces/commit-file.repository.interface.ts";

export class GetCommitFilesUseCase {
  constructor(
    private readonly commitFileRepository: CommitFileRepositoryInterface,
  ) {}

  execute(
    filter?: Partial<{ addables: boolean; commitables: boolean }>,
  ): Promise<CommitFile[]> {
    if (filter?.addables) {
      return this.commitFileRepository.findAddables();
    } else if (filter?.commitables) {
      return this.commitFileRepository.findCommitables();
    }
    return this.commitFileRepository.findAll();
  }
}
