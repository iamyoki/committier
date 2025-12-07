import type { CommitFileInfo } from "../../domain/commit.ts";
import type { CommitRepositoryInterface } from "../../domain/interfaces/commit.repository.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";

export class AddUseCase {
  constructor(
    private readonly commitRepository: CommitRepositoryInterface,
    private readonly git: GitInterface,
  ) {}

  async execute(filePaths: string[]) {
    const commit = this.commitRepository.get();
    if (!commit) throw new Error("Nothing to add");

    const addableFiles = commit.getAddableFiles();

    const fileInfos: CommitFileInfo[] = [];

    for (const fp of filePaths) {
      const fileInfo = addableFiles.find((f) => f.filePath === fp);
      if (fileInfo) fileInfos.push(fileInfo);
    }

    if (fileInfos.length) await this.git.add(fileInfos);

    commit.add(addableFiles.map((f) => f.fileName));
  }
}
