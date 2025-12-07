#!/usr/bin/env node

import { program } from "commander";
import { AddUseCase } from "../lib/application/use-cases/add.use-case.ts";
import { CommitUseCase } from "../lib/application/use-cases/commit.use-case.ts";
import { GetCommitFilesUseCase } from "../lib/application/use-cases/get-commit-files.use-case.ts";
import { InferEmojiUseCase } from "../lib/application/use-cases/infer-emoji.use-case.ts";
import { SyncGitFilesUseCase } from "../lib/application/use-cases/sync-git-files.use-case.ts";
import { Git } from "../lib/infrastructure/git/git.ts";
import { CommitInMemoryRepository } from "../lib/infrastructure/repositories/commit-in-memory.repository.ts";
import { CommitCLI } from "../lib/presentation/cli/commit-cli.ts";

program
  .description("CLI commit tool")
  .option("--emoji", "infer emoji from type", false)
  .option(
    "--scope",
    "infer scope from package names, useful in monorepo",
    false,
  )
  .option("-d, --dry-run", "preview the commit message without commit");

program.parse();
const options = program.opts();

const commitRepository = new CommitInMemoryRepository();
const git = new Git();

const syncGitFilesUseCase = new SyncGitFilesUseCase(commitRepository, git);
const getCommitFilesUseCase = new GetCommitFilesUseCase(commitRepository);
const inferEmojiUseCase = new InferEmojiUseCase();
const commitUseCase = new CommitUseCase(commitRepository, git);
const addUseCase = new AddUseCase(commitRepository, git);

const commitCLI = new CommitCLI(
  syncGitFilesUseCase,
  getCommitFilesUseCase,
  inferEmojiUseCase,
  commitUseCase,
  addUseCase,
);

commitCLI.execute({
  emoji: options.emoji,
  ...(options.scope && { inferScope: "package" }),
  dryRun: options.dryRun,
});
