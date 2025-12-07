import type { Commit } from "../../domain/commit.ts";
import type { CommitRepositoryInterface } from "../../domain/interfaces/commit.repository.interface.ts";

export class CommitInMemoryRepository implements CommitRepositoryInterface {
  private commit?: Commit;

  save(commit: Commit): void {
    this.commit = commit;
  }

  get(): Commit | undefined {
    return this.commit;
  }
}
