#!/usr/bin/env node

import path from "node:path";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ConfigService } from "../application/services/config.service.ts";
import { AddFilesUseCase } from "../application/use-cases/add-files.use-case.ts";
import { CommitFilesUseCase } from "../application/use-cases/commit-files.use-case.ts";
import { EditUseCase } from "../application/use-cases/edit.use-case.ts";
import { FormatUseCase } from "../application/use-cases/format.use-case.ts";
import { GetCommitFilesUseCase } from "../application/use-cases/get-commit-files.use-case.ts";
import { CosmiconfigConfigLoader } from "../infrastructure/cosmiconfig-config-loader.ts";
import { FsCommitMsgFile } from "../infrastructure/fs-commit-msg-file.ts";
import { GitCommitFileRepository } from "../infrastructure/git-commit-file.repository.ts";
import { Git } from "../infrastructure/git.ts";
import { CommitPrompt } from "../presentation/commit-prompt.ts";

yargs()
  // setup
  .scriptName("committier")
  .wrap(yargs().terminalWidth())
  .usage(
    `${pc.greenBright("⚡︎$0")}

${pc.dim(pc.greenBright("Fix and format commit messages."))}`,
  )
  .alias("v", "version")
  .alias("h", "help")
  // edit
  .command(
    "edit <file>",
    "Format and edit commit message file",
    (yargs) => {
      yargs.positional("file", { type: "string" });
      yargs.example(
        `${pc.dim('Edit in ".husky/commit-msg" file:')}
npx --no -- committier edit $1`,
        "",
      );
    },
    async (args) => {
      const filePath = path.resolve(args.file as string);
      const commitMsgFile = new FsCommitMsgFile();
      const configLoader = new CosmiconfigConfigLoader();
      const configService = new ConfigService(configLoader);
      const config = await configService.getConfig();
      const format = new FormatUseCase(config);
      const edit = new EditUseCase(format, commitMsgFile);
      await edit.execute(filePath);
    },
  )
  // format
  .command(
    "format <message>",
    "Format and preview the message",
    (yargs) => {
      yargs.positional("message", {
        type: "string",
      });
      yargs.example('$0 format "feat: cool"', pc.dim('"✨ feat: cool"'));
      yargs.example('$0 format "feat cool"', pc.dim('"✨ feat: cool"'));
      yargs.example(
        '$0 format "feat app1,app2 cool"',
        pc.dim('"✨ feat(app1,app2): cool"'),
      );
      yargs.example('$0 format ": errors"', pc.dim('"🐛 fix: errors"'));
    },
    async (args) => {
      const rawMessage = [args.message, ...args._.slice(1)].join(" ").trim();
      const configLoader = new CosmiconfigConfigLoader();
      const configService = new ConfigService(configLoader);
      const config = await configService.getConfig();
      const format = new FormatUseCase(config);
      const commitFileRepository = new GitCommitFileRepository(
        !!config.autoScope,
      );
      const getCommitFilesUseCase = new GetCommitFilesUseCase(
        commitFileRepository,
      );
      const commitFiles = await getCommitFilesUseCase.execute({
        commitables: true,
      });
      const message = await format.execute({ rawMessage, commitFiles });
      console.log(message);
    },
  )
  // commit
  .command(
    "commit",
    "CLI commit tool for humanity",
    (yargs) => {
      yargs.option("dry-run", {
        alias: "d",
        type: "boolean",
        default: false,
        desc: "Only preview the commit result, not actually committing",
      });
    },
    async (args) => {
      const dryRunMode = args.dryRun as boolean;
      const configLoader = new CosmiconfigConfigLoader();
      const configService = new ConfigService(configLoader);
      const config = await configService.getConfig();

      const commitFileRepository = new GitCommitFileRepository(
        !!config.autoScope,
      );
      const getCommitFilesUseCase = new GetCommitFilesUseCase(
        commitFileRepository,
      );

      const git = new Git();
      const addFilesUseCase = new AddFilesUseCase(git, commitFileRepository);

      const commitFilesUseCase = new CommitFilesUseCase(
        git,
        commitFileRepository,
      );

      const formatUseCase = new FormatUseCase(config);

      const commitPrompt = new CommitPrompt(
        config,
        getCommitFilesUseCase,
        addFilesUseCase,
        commitFilesUseCase,
        formatUseCase,
      );

      commitPrompt.run(dryRunMode);
    },
  )
  .demandCommand(1, "You need at least one command before moving on")
  .parse(hideBin(process.argv));
