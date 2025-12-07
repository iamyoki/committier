#!/usr/bin/env node

import path from "node:path";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AddFilesUseCase } from "../commit/application/use-case/add-files.use-case.ts";
import { CommitFilesUseCase } from "../commit/application/use-case/commit-files.use-case.ts";
import { GetCommitFilesUseCase } from "../commit/application/use-case/get-commit-files.use-case.ts";
import { GitCommitFileRepository } from "../commit/infrastructure/git-commit-file.repository.ts";
import { Git } from "../commit/infrastructure/git.ts";
import { CommitCLI } from "../commit/presentation/cli/commit.cli.ts";
import { EditUseCase } from "../edit/application/use-cases/edit.use-case.ts";
import { FsCommitMsgFile } from "../edit/infrastructure/fs-commit-msg-file.ts";
import { ConfigService } from "../format/application/services/config.service.ts";
import { FormatUseCase } from "../format/application/use-cases/format.use-case.ts";
import { CosmiconfigConfigLoader } from "../format/infrastructure/cosmiconfig-config-loader.ts";

yargs()
  // setup
  .scriptName("committier")
  .wrap(yargs().terminalWidth())
  .usage(
    `${pc.greenBright("⚡︎$0")}

${pc.dim(pc.greenBright("Fix and Format commit messages."))}`,
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
      const message = format.execute(rawMessage);
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

      const commitCLI = new CommitCLI(
        config,
        getCommitFilesUseCase,
        addFilesUseCase,
        commitFilesUseCase,
        formatUseCase,
      );

      commitCLI.run(dryRunMode);
    },
  )
  .demandCommand(1, "You need at least one command before moving on")
  .parse(hideBin(process.argv));
