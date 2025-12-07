#!/usr/bin/env node

import { program } from "commander";
import { CommitMessageHookUseCase } from "../lib/application/use-cases/commit-message-hook.use-case.ts";
import { InferEmojiUseCase } from "../lib/application/use-cases/infer-emoji.use-case.ts";
import { CommitMessageStorage } from "../lib/index.ts";
import { Git } from "../lib/infrastructure/git/git.ts";

program
  .argument("<path>", "COMMIT_EDITMSG file path")
  .option(
    "--scope",
    "infer scope from package names, useful in monorepo",
    false,
  );

program.parse();
const options = program.opts();

const gitMessageFilePath = program.args[0] ?? "";

const commitMessageStorage = new CommitMessageStorage(gitMessageFilePath);
const git = new Git();

const inferEmojiUseCase = new InferEmojiUseCase();
const emojiGitHookUseCase = new CommitMessageHookUseCase(
  commitMessageStorage,
  inferEmojiUseCase,
  git,
);

emojiGitHookUseCase.execute(options.scope);
