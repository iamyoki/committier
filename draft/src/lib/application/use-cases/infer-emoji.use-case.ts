import type { CommitMessage } from "../../domain/commit-message.ts";
import { CommitType } from "../constants/commit-type.constant.ts";

export class InferEmojiUseCase {
  constructor() {}

  execute(commitMessage: CommitMessage): string | undefined {
    const type = commitMessage.type;
    const scope = commitMessage.scope;
    const typeAndScope = `${type}${scope ?? ""}`;

    let emoji: string | undefined;

    if (typeAndScope in CommitType) {
      emoji = CommitType[type as keyof typeof CommitType].emoji;
    } else {
      emoji = Object.entries(CommitType).find(([k]) =>
        typeAndScope.startsWith(k),
      )?.[1].emoji;
    }

    return emoji;
  }
}
