import type { CommitFileRepositoryInterface } from "../../domain/interfaces/commit-file.repository.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";

export class AddFilesUseCase {
  constructor(
    private readonly git: GitInterface,
    private readonly commitFileRepository: CommitFileRepositoryInterface,
  ) {}

  async execute(filePaths: string[]) {
    const addableCommitFiles = await this.commitFileRepository.findAddables();

    const files = addableCommitFiles.filter((f) =>
      filePaths.includes(f.filePath),
    );

    const finalFilePaths = files.map((f) => f.filePath);

    await this.git.add(finalFilePaths);
  }
}
