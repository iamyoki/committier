import type { CommitMsgFileInterface } from "../application/interfaces/commit-msg-file.interface.ts";
import type { EditUseCase } from "../application/use-cases/edit.use-case.ts";
import type { FormatUseCase } from "../application/use-cases/format.use-case.ts";
import type { GetCommitFilesUseCase } from "../application/use-cases/get-commit-files.use-case.ts";

export class GitHook {
  constructor(
    private readonly commitMsgFile: CommitMsgFileInterface,
    private readonly getCommitFilesUseCase: GetCommitFilesUseCase,
    private readonly formatUseCase: FormatUseCase,
    private readonly editUseCase: EditUseCase,
  ) {}

  async execute(filePath?: string) {
    const rawMessage = await this.commitMsgFile.read(filePath);
    const commitFiles = await this.getCommitFilesUseCase.execute({
      commitables: true,
    });
    const finalMessage = await this.formatUseCase.execute({
      rawMessage,
      commitFiles,
    });
    this.editUseCase.execute(finalMessage, filePath);
  }
}
