import {
  autocomplete,
  cancel,
  confirm,
  group,
  intro,
  multiselect,
  outro,
  spinner,
  text,
} from "@clack/prompts";
import pc from "picocolors";
import { DefaultConfig } from "../application/constants/default-config.constant.ts";
import type { ConfigType } from "../application/types/config.type.ts";
import type { AddFilesUseCase } from "../application/use-cases/add-files.use-case.ts";
import type { CommitFilesUseCase } from "../application/use-cases/commit-files.use-case.ts";
import type { FormatUseCase } from "../application/use-cases/format.use-case.ts";
import type { GetCommitFilesUseCase } from "../application/use-cases/get-commit-files.use-case.ts";
import type { CommitFile } from "../domain/commit-file.ts";

export class CommitPrompt {
  constructor(
    private readonly config: ConfigType,
    private readonly getCommitFilesUseCase: GetCommitFilesUseCase,
    private readonly addFilesUseCase: AddFilesUseCase,
    private readonly commitFilesUseCase: CommitFilesUseCase,
    private readonly formatUseCase: FormatUseCase,
  ) {}

  async run(dryRunMode: boolean) {
    console.clear();
    intro(pc.greenBright("⚡︎ committier commit"));

    const addableFiles = await this.getCommitFilesUseCase.execute({
      addables: true,
    });

    const commitableFiles = await this.getCommitFilesUseCase.execute({
      commitables: true,
    });

    let finalMessage: string;

    const g = await group(
      {
        ...(addableFiles.length && {
          add: () =>
            multiselect({
              message: "Add files",
              options: addableFiles.map((f) => ({
                value: f,
                label: f.fileName,
                hint: f.filePath,
              })),
              initialValues: addableFiles,
              required: false,
            }),
        }),
        commit: ({ results: { add = [] } }) => {
          const files = this.uniqueBy([...add, ...commitableFiles], "filePath");
          return multiselect({
            message: "Commit files",
            options: files.map((f) => ({
              value: f,
              label: f.fileName,
              hint: f.filePath,
            })),
            initialValues: files,
            required: true,
          });
        },
        type: () =>
          autocomplete({
            message: "Type",
            options: Object.entries(DefaultConfig.types).map(([k, v]) => ({
              value: k,
              label: k,
              hint: v.title,
            })),
          }),
        ...(this.config.autoScope !== true &&
          this.config.autoScope !== "replaceToPackageName" && {
            scope: () =>
              text({
                message: "Scope" + ` ${pc.dim("(Optional)")}`,
                placeholder: 'e.g. "app1,app2"',
              }),
          }),
        description: () =>
          text({
            message: "Description",
            validate(value) {
              if (!value) return `Description is required!`;
            },
          }),
        confirm: async ({ results }) => {
          const rawMessage: string = `${results.type}${results.scope ? `(${results.scope})` : ""}: ${results.description}`;

          const commitFiles = results.commit as CommitFile[];

          finalMessage = await this.formatUseCase.execute({
            rawMessage,
            commitFiles,
          });
          return confirm({
            message: `Confirm: ${finalMessage}`,
          });
        },
      },
      {
        onCancel: () => {
          cancel("Commit cancelled.");
          process.exit(0);
        },
      },
    );

    if (dryRunMode) {
      cancel("Done. (Nothing committed due to `--dry-run` mode)");
      process.exit(0);
    }

    if (g.add && g.add.length > 0) {
      const s = spinner();
      s.start("Executing: git add");
      await this.addFilesUseCase.execute(g.add.map((f) => f.filePath));
      s.stop("Done: git add");
    }

    const s = spinner();
    s.start("Executing: git commit");
    await this.commitFilesUseCase.execute(
      finalMessage!,
      (g.commit as CommitFile[]).map((f) => f.filePath),
    );
    s.stop("Done: git commit");
    outro("Done.");
    process.exit(0);
  }

  private uniqueBy<T>(items: T[], key: keyof T): T[] {
    const map = new Map();

    for (const item of items) {
      if (!map.has(item[key])) {
        map.set(item[key], item);
      }
    }
    return Array.from(map.values());
  }
}
