#!/usr/bin/env node

import path from "node:path";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { di, getConfig } from "./di.ts";

// ${pc.dim(pc.greenBright("Fix and format commit messages."))}

yargs()
  // setup
  .scriptName("committier")
  .wrap(yargs().terminalWidth())
  .usage(`${pc.greenBright("⚡︎$0")}`)
  .alias("v", "version")
  .alias("h", "help")
  .example([
    ["$0 ai", pc.dim("Use AI actions")],
    [
      '$0 format "feat app1,app2 add foo bar"',
      pc.dim("Preview the formatted result"),
    ],
    ["$0 commit", pc.dim("Use commit CLI")],
  ])
  // edit
  .command(
    "edit <file>",
    "format and edit commit message file",
    (yargs) => {
      yargs.positional("file", { type: "string" });
      yargs.example(
        `${pc.dim('Edit in ".husky/commit-msg" file:')}
npx --no -- committier edit $1`,
        "",
      );
    },
    async (args) => {
      const config = await getConfig();
      const container = di(config);
      const filePath = path.resolve(args.file as string);
      await container.presenters.gitHook.execute(filePath);
    },
  )
  // format
  .command(
    "format <message>",
    "format and preview the message",
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
      const config = await getConfig();
      const container = di(config);
      const commitFiles =
        await container.useCases.getCommitFilesUseCase.execute({
          commitables: true,
        });
      const finalMessage = await container.useCases.formatUseCase.execute({
        rawMessage,
        commitFiles,
      });
      console.log(finalMessage);
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
      const config = await getConfig();
      const container = di(config);
      await container.presenters.commitPrompt.run(dryRunMode);
    },
  )
  // AI
  .command(
    "ai",
    "(Beta) AI actions",
    (yargs) => {
      yargs.option("dry-run", {
        alias: "d",
        type: "boolean",
        default: false,
        desc: "Only preview the AI result, not actually affecting",
      });
    },
    async (args) => {
      const dryRunMode = args.dryRun as boolean;
      const config = await getConfig();
      const container = di(config);
      await container.presenters.aiPrompt.run(dryRunMode);
    },
  )
  .demandCommand(1, "You need at least one command before moving on")
  .parse(hideBin(process.argv));
