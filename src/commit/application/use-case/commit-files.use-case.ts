import type { CommitFileRepositoryInterface } from "../../domain/interfaces/commit-file.repository.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";

export class CommitFilesUseCase {
  constructor(
    private readonly git: GitInterface,
    private readonly commitFileRepository: CommitFileRepositoryInterface,
  ) {}

  async execute(message: string, filePaths?: string[]) {
    if (filePaths) {
      const commitableCommitFiles =
        await this.commitFileRepository.findCommitables();

      const files = commitableCommitFiles.filter((f) =>
        filePaths.includes(f.filePath),
      );

      const finalFilePaths = files.map((f) => f.filePath);

      await this.git.commit(message, finalFilePaths);
    } else {
      await this.git.commit(message);
    }
  }
}
