import type { CommitFile } from "../commit-file.ts";

export interface CommitFileRepositoryInterface {
  findAll(): Promise<CommitFile[]>;
  findAddables(): Promise<CommitFile[]>;
  findCommitables(): Promise<CommitFile[]>;
}
