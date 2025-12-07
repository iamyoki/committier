import { Commit } from "../../domain/commit.ts";
import type { CommitRepositoryInterface } from "../../domain/interfaces/commit.repository.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";

export class SyncGitFilesUseCase {
  constructor(
    private readonly commitRepository: CommitRepositoryInterface,
    private readonly git: GitInterface,
  ) {}

  async execute(readPacakgeName: boolean): Promise<void> {
    const commitFileInfos = await this.git.getFiles(readPacakgeName);
    const commit = Commit.create(commitFileInfos);
    this.commitRepository.save(commit);
  }
}
