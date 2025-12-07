import type { Commit } from "../commit.ts";

export interface CommitRepositoryInterface {
  save(commit: Commit): void;
  get(): Commit | undefined;
}
