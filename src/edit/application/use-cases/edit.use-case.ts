import type { FormatUseCase } from "../../../format/application/use-cases/format.use-case.ts";
import type { CommitMsgFileInterface } from "../interfaces/commit-msg-file.interface.ts";

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
