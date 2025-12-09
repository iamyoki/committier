import type { CommitMsgFileInterface } from "../interfaces/commit-msg-file.interface.ts";
import type { FormatUseCase } from "./format.use-case.ts";
import type { GetCommitFilesUseCase } from "./get-commit-files.use-case.ts";

export class EditUseCase {
  constructor(
    private readonly formatUseCase: FormatUseCase,
    private readonly commitMsgFile: CommitMsgFileInterface,
    private readonly getCommitFilesUseCase: GetCommitFilesUseCase,
  ) {}

  async execute(commitMsgFilePath: string): Promise<void> {
    const commitFiles = await this.getCommitFilesUseCase.execute({
      commitables: true,
    });
    const rawMessage = await this.commitMsgFile.read(commitMsgFilePath);
    const finalMessage = await this.formatUseCase.execute({
      rawMessage,
      commitFiles,
    });
    await this.commitMsgFile.write(finalMessage);
  }
}
