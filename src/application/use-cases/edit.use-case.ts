import type { CommitMsgFileInterface } from "../interfaces/commit-msg-file.interface.ts";
import type { FormatUseCase } from "./format.use-case.ts";

export class EditUseCase {
  constructor(
    private readonly formatUseCase: FormatUseCase,
    private readonly commitMsgFile: CommitMsgFileInterface,
  ) {}

  async execute(filePath: string): Promise<void> {
    const rawMessage = await this.commitMsgFile.read(filePath);
    const finalMessage = this.formatUseCase.execute(rawMessage);
    await this.commitMsgFile.write(finalMessage);
  }
}
