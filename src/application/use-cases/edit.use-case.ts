import type { CommitMsgFileInterface } from "../interfaces/commit-msg-file.interface.ts";

export class EditUseCase {
  constructor(private readonly commitMsgFile: CommitMsgFileInterface) {}

  async execute(
    finalMessage: string,
    commitMsgFilePath?: string,
  ): Promise<void> {
    await this.commitMsgFile.write(finalMessage, commitMsgFilePath);
  }
}
