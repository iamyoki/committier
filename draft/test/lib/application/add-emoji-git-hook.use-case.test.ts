import as from "node:assert";
import { describe, it, mock } from "node:test";
import type { GitInterface } from "../../../src/lib/application/interfaces/git.interface.ts";
import { CommitMessageHookUseCase } from "../../../src/lib/application/use-cases/commit-message-hook.use-case.ts";
import { InferEmojiUseCase } from "../../../src/lib/application/use-cases/infer-emoji.use-case.ts";
import { CommitMessage } from "../../../src/lib/domain/commit-message.ts";

const cases = [
  ["feat: a new feature", { emoji: "✨" }],
  ["feat(app1,app2): a new feature", { emoji: "✨" }],
  ["fix: type error", { emoji: "🐛" }],
  ["chore: config something", { emoji: "♻️" }],
  ["nope: nothing", { emoji: undefined }], //
] as const;

describe("UseCase: Emoji git hook", () => {
  cases.forEach(([msg, expected]) => {
    it(((expected.emoji && `${expected.emoji} `) ?? "") + msg, () => {
      const commitMessage = CommitMessage.fromCommitMessageStr(msg);

      const mockSetEmoji = mock.method(commitMessage, "setEmoji");

      const mockCommitMessageStorage = {
        read: mock.fn(() => commitMessage),
        save: mock.fn(),
      };

      const inferEmojiUseCase = new InferEmojiUseCase();
      const git = {} as GitInterface;

      const emojiGitHookUseCase = new CommitMessageHookUseCase(
        mockCommitMessageStorage,
        inferEmojiUseCase,
        git,
      );
      emojiGitHookUseCase.execute();

      as.strictEqual(mockCommitMessageStorage.read.mock.callCount(), 1);
      if (expected.emoji) {
        as.strictEqual(mockCommitMessageStorage.save.mock.callCount(), 1);
        as.strictEqual(mockSetEmoji.mock.callCount(), 1);
        as.strictEqual(
          mockSetEmoji.mock.calls[0]?.arguments[0],
          expected.emoji,
        );
        as.strictEqual(
          mockCommitMessageStorage.save.mock.calls[0]?.arguments[0].emoji,
          expected.emoji,
        );
      }
    });
  });
});
