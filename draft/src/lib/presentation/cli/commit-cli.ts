import {
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import color from "picocolors";
import { CommitType } from "../../application/constants/commit-type.constant.ts";
import type { AddUseCase } from "../../application/use-cases/add.use-case.ts";
import type { CommitUseCase } from "../../application/use-cases/commit.use-case.ts";
import type { GetCommitFilesUseCase } from "../../application/use-cases/get-commit-files.use-case.ts";
import type { InferEmojiUseCase } from "../../application/use-cases/infer-emoji.use-case.ts";
import type { SyncGitFilesUseCase } from "../../application/use-cases/sync-git-files.use-case.ts";
import { CommitMessage } from "../../domain/commit-message.ts";
import type { CommitFileInfo } from "../../domain/commit.ts";

export type CommitCLIOptions = {
  inferScope?: "package";
  emoji?: boolean;
  dryRun?: boolean;
};

export class CommitCLI {
  constructor(
    private readonly syncGitFilesUseCase: SyncGitFilesUseCase,
    private readonly getCommitFilesUseCase: GetCommitFilesUseCase,
    private readonly inferEmojiUseCase: InferEmojiUseCase,
    private readonly commitUseCase: CommitUseCase,
    private readonly addUseCase: AddUseCase,
  ) {}

  async execute(options?: CommitCLIOptions) {
    await this.syncGitFilesUseCase.execute(options?.inferScope === "package");
    const addableFileInfos = await this.getCommitFilesUseCase.execute({
      addable: true,
    });

    console.clear();
    intro(color.bgGreen(color.black(" ⚡︎Committier ")));

    if (addableFileInfos.length) {
      const addFileInfos = await this.addFiles(addableFileInfos);
      if (addFileInfos.length) {
        await this.addUseCase.execute(addFileInfos.map((f) => f.filePath));
        await this.syncGitFilesUseCase.execute(
          options?.inferScope === "package",
        );
      }
    }

    const commitFileInfos = await this.getCommitFilesUseCase.execute({
      commitable: true,
    });
    if (!commitFileInfos.length) {
      outro("Nothing to commit");
      return;
    }
    const files = await this.selectFiles(commitFileInfos);

    const type = await this.pickType();

    let scope: string | undefined;
    if (!options?.inferScope) scope = await this.inputScope();

    const description = await this.inputDescription();

    let commitMessage = new CommitMessage(
      undefined,
      type,
      scope?.replaceAll(" ", ""),
      false,
      description,
      undefined,
    );

    if (options?.inferScope === "package") {
      commitMessage = commitMessage.setPackageNamesAsScope(
        files.filter((f) => f.packageName).map((f) => f.packageName!),
      );
    }

    if (options?.emoji) {
      const emoji = this.inferEmojiUseCase.execute(commitMessage);
      if (emoji) commitMessage = commitMessage.setEmoji(emoji);
    }

    const finalMessageStr = commitMessage.toCommitMessageStr();

    const confirm = await this.confirm(finalMessageStr);

    if (confirm) {
      const s = spinner();
      s.start("Git committing");

      if (!options?.dryRun)
        await this.commitUseCase.execute(
          finalMessageStr,
          options?.inferScope === "package",
        );

      s.stop(
        options?.dryRun
          ? "Done. (No afffects due to `--dry-run` mode)"
          : "Done.",
      );
    } else {
      outro("Abort.");
    }
  }

  private async trap<T>(promise: Promise<T>) {
    const res = await promise;
    if (isCancel(res)) {
      outro("Abort.");
      process.exit(0);
    }
    return res;
  }

  private async addFiles(addableFileInfos: CommitFileInfo[]) {
    return (await this.trap(
      multiselect({
        message: "Add files",
        //  + color.dim(` (Press ${color.bgBlackBright(" space ")} to toggle)`),
        options: addableFileInfos.map((f) => ({
          value: f,
          label: f.fileName,
          hint: f.filePath,
        })),
        initialValues: addableFileInfos,
        required: false,
      }),
    )) as CommitFileInfo[];
  }

  private async selectFiles(commitableFileInfos: CommitFileInfo[]) {
    return (await this.trap(
      multiselect({
        message: "Commit files",
        //  + color.dim(` (Press ${color.bgBlackBright(" space ")} to toggle)`),
        options: commitableFileInfos.map((f) => ({
          value: f,
          label: f.fileName,
          hint: f.filePath,
        })),
        initialValues: commitableFileInfos,
        required: true,
      }),
    )) as CommitFileInfo[];
  }

  private async pickType() {
    return (await this.trap(
      select<string>({
        message: "Type",
        options: Object.entries(CommitType).map(([k, v]) => ({
          value: k,
          label: k,
          hint: v.title,
        })),
      }),
    )) as string;
  }

  private async inputScope() {
    return (await this.trap(
      text({
        message: "Scope" + ` ${color.dim('(Optional) e.g. "app1,app2"')}`,
        defaultValue: " ",
      }),
    )) as string;
  }

  private async inputDescription() {
    return (await this.trap(
      text({
        message: "Description",
        validate(value) {
          if (!value) return `Description is required!`;
        },
      }),
    )) as string;
  }

  private async confirm(finalMessage: string) {
    return await this.trap(
      confirm({
        message: `Confirm: ${color.green(finalMessage)}`,
      }),
    );
  }
}
