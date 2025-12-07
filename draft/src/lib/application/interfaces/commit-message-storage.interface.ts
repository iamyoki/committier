import type { CommitMessage } from "../../domain/commit-message.ts";

export interface CommitMessageStorageInterface {
  read(): CommitMessage;
  save(newCommitMessage: CommitMessage): void;
}
