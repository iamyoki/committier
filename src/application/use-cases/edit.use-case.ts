import type { CommitMsgFileInterface } from "../interfaces/commit-msg-file.interface.ts";
import type { FormatUseCase } from "./format.use-case.ts";

export class EditUseCase {
  constructor(
    private readonly formatUseCase: FormatUseCase,
    private readonly commitMsgFile: CommitMsgFileInterface,
  ) {}

  async execute(commitMsgFilePath: string): Promise<void> {
    const rawMessage = await this.commitMsgFile.read(commitMsgFilePath);
    const finalMessage = await this.formatUseCase.execute({ rawMessage });
    await this.commitMsgFile.write(finalMessage);
  }
}
