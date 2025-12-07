import type { CommitMessageStorageInterface } from "../interfaces/commit-message-storage.interface.ts";
import type { GitInterface } from "../interfaces/git.interface.ts";
import type { InferEmojiUseCase } from "./infer-emoji.use-case.ts";

export class CommitMessageHookUseCase {
  constructor(
    private readonly commitMessageStorage: CommitMessageStorageInterface,
    private readonly inferEmojiUseCase: InferEmojiUseCase,
    private readonly git: GitInterface,
  ) {}

  async execute(inferPackageNameAsScope: boolean = false): Promise<void> {
    let commitMessage = this.commitMessageStorage.read();
    const emoji = this.inferEmojiUseCase.execute(commitMessage);

    if (emoji) {
      commitMessage = commitMessage.setEmoji(emoji);
    }

    if (inferPackageNameAsScope && !commitMessage.scope) {
      const fileInfos = await this.git.getFiles(true);
      commitMessage = commitMessage.setPackageNamesAsScope(
        fileInfos.filter((f) => !!f.packageName).map((f) => f.packageName!),
      );
    }

    this.commitMessageStorage.save(commitMessage);
  }
}
