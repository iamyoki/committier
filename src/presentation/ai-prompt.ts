import {
  box,
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import pc from "picocolors";
import { DefaultConfig } from "../application/constants/default-config.constant.ts";
import { AIGenerateUseCase } from "../application/use-cases/ai/ai-generate.use-case.js";
import { CommitFilesUseCase } from "../application/use-cases/commit-files.use-case.js";
import { FormatUseCase } from "../application/use-cases/format.use-case.js";
import { GetCommitFilesUseCase } from "../application/use-cases/get-commit-files.use-case.js";
import type { CommitFile } from "../domain/commit-file.ts";
import { AiCommitGenerator } from "../infrastructure/ai-commit-generator.ts";
import { GitCommitFileRepository } from "../infrastructure/git-commit-file.repository.ts";
import { Git } from "../infrastructure/git.ts";

export class CommitPrompt {
  constructor(
    private readonly aiGenerateUseCase: AIGenerateUseCase,
    private readonly formatUseCase: FormatUseCase,
    private readonly getCommitFilesUseCase: GetCommitFilesUseCase,
    private readonly commitFilesUseCase: CommitFilesUseCase,
  ) {}

  async run(dryRunMode?: boolean) {
    console.clear();
    intro(pc.greenBright("⚡︎ committier ai"));

    const commitableFiles = await this.getCommitFilesUseCase.execute({
      commitables: true,
    });

    if (!commitableFiles.length) {
      this.handleCancel(
        "No files to commit with, please use `git add ...` to staged some files first",
      );
    }

    const action = await select({
      message: "Pick an AI action",
      options: [
        {
          value: "generate-commit-msg",
          label: "✨ Generate commit message",
          hint: pc.italic(pc.dim("Based on staged changes")),
        },
        {
          value: "summarize",
          label: "📝 Summarize changes",
        },
        {
          value: "suggestion",
          label: "🧠 Provide suggestions for improvement",
        },
        { value: "find-bugs", label: "🔍 Find bugs" },
        {
          value: "ask",
          label: "💬 Ask AI",
        },
      ],
    });

    switch (action) {
      case "generate-commit-msg": {
        await this.generateCommitMsg(commitableFiles);
        break;
      }
    }

    if (isCancel(action)) this.handleCancel();

    if (dryRunMode) {
      cancel("Done. (Nothing act due to `--dry-run` mode)");
      process.exit(0);
    }

    outro("Done.");
  }

  private handleCancel(msg?: string) {
    cancel(msg ?? "Abort.");
    process.exit(0);
  }

  private async generateCommitMsg(commitFiles: CommitFile[]) {
    const userIntent = await text({
      message: "Describe your intent to make AI more accurate (Optional)",
      placeholder: "e.g. feat, fix core",
    });

    const s = spinner({ onCancel: () => this.handleCancel() });
    s.start("Generating");

    const aiCommitMessage = await this.aiGenerateUseCase.execute(
      userIntent.toString(),
    );

    s.stop("Generated commit message");

    const str = `${aiCommitMessage.type}: ${aiCommitMessage.description}\n\n${aiCommitMessage.body?.map((item) => `- ${item}`).join("\n")}`;
    const formatted = await this.formatUseCase.execute({
      rawMessage: str,
      commitFiles,
    });

    box(formatted, undefined, {
      width: "auto",
      formatBorder: pc.greenBright,
      rounded: true,
    });

    const yes = await confirm({ message: "Commit now?" });

    if (yes) {
      const s = spinner();
      s.start("Executing: git commit");
      try {
        await this.commitFilesUseCase.execute(
          formatted,
          commitFiles.map((f) => f.filePath),
        );
      } catch (error) {
        console.log(error);
      }
      s.stop("Done: git commit");
    } else {
      this.handleCancel();
    }

    if (isCancel(userIntent)) this.handleCancel();
  }
}

if (import.meta.main) {
  const aiCommitGenerator = new AiCommitGenerator();
  const aiGenerateUseCase = new AIGenerateUseCase(aiCommitGenerator);
  const formatUseCase = new FormatUseCase(DefaultConfig);
  const git = new Git();
  const gitCommitFileRepository = new GitCommitFileRepository(false);
  const commitFilesUseCase = new CommitFilesUseCase(
    git,
    gitCommitFileRepository,
  );
  const getCommitFilesUseCase = new GetCommitFilesUseCase(
    gitCommitFileRepository,
  );
  new CommitPrompt(
    aiGenerateUseCase,
    formatUseCase,
    getCommitFilesUseCase,
    commitFilesUseCase,
  ).run();
}
