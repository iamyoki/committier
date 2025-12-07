import chalk from "chalk";
import path from "node:path";
import prompts, { type Choice } from "prompts";
import { readPackageUpSync } from "read-package-up";
import { simpleGit, type SimpleGit } from "simple-git";
import { EMOJI_MAP } from "./constants.js";

class File {
  constructor(
    public readonly filePath: string,
    public readonly fileName: string,
    public readonly pacakgeName: string,
    public commitable: boolean,
    public addable: boolean,
  ) {}

  commit() {
    this.commitable = false;
  }

  add() {
    this.addable = false;
    this.commitable = true;
  }
}

export class Model {
  private files: File[] = [];
  private readonly git: SimpleGit = simpleGit();

  async scan() {
    const status = await this.git.status();
    const statusFiles = status.files;
    const files = statusFiles.map(({ path: filePath, index, working_dir }) => {
      const fileName = path.basename(filePath);
      const packageJson = readPackageUpSync({ cwd: filePath })?.packageJson;
      const packageName = packageJson?.name ?? "";
      return new File(
        filePath,
        fileName,
        packageName,
        index !== " " && index !== "?",
        working_dir !== " ",
      );
    });
    this.files = files;
  }

  getAllPackages(): string[] {
    const set = new Set(this.files.map((file) => file.pacakgeName));
    return Array.from(set);
  }

  getCommitablePackages(): string[] {
    const set = new Set(
      this.files
        .filter((file) => file.commitable)
        .map((file) => file.pacakgeName),
    );
    return Array.from(set);
  }

  getAddablePackages(): string[] {
    const set = new Set(
      this.files.filter((file) => file.addable).map((file) => file.pacakgeName),
    );
    return Array.from(set);
  }

  getAllFiles(packages?: string[]): File[] {
    if (packages) {
      return this.files.filter((file) => packages.includes(file.pacakgeName));
    }
    return this.files;
  }

  getCommitableFiles(packages?: string[]): File[] {
    if (packages) {
      return this.files.filter(
        (file) => file.commitable && packages.includes(file.pacakgeName),
      );
    }
    return this.files.filter((file) => file.commitable);
  }

  getAddableFiles(packages?: string[]): File[] {
    if (packages) {
      return this.files.filter(
        (file) => file.addable && packages.includes(file.pacakgeName),
      );
    }
    return this.files.filter((file) => file.addable);
  }

  async add(files: File[]) {
    for (const file of files) {
      if (!file.addable) continue;
      await this.git.add(file.filePath);
      file.add();
    }
  }

  async commit(type: string, description: string) {
    const commitMessage = this.generateCommitMessage(type, description, false);
    await this.git.commit(commitMessage);
  }

  generateCommitMessage(
    type: string,
    description: string,
    addEmoji: boolean,
  ): string {
    // const pacakges = this.getCommitablePackages();

    // const scope = pacakges.length
    //   ? `(${pacakges.map((name) => name || "root").join(", ")})`
    //   : "";

    let emoji = this.getEmojiByType(type);
    emoji = emoji ? `${emoji} ` : "";

    const commitMessage = addEmoji
      ? `${emoji}${type}: ${description}`
      : `${type}: ${description}`;

    return commitMessage;
  }

  private getEmojiByType(type: string): string | undefined {
    let emoji = EMOJI_MAP[type]?.emoji;
    if (!emoji) {
      const key = Object.keys(EMOJI_MAP).find((key) => type.startsWith(key));
      if (key) {
        emoji = EMOJI_MAP[key]?.emoji;
      }
    }
    return emoji;
  }
}

/**
 * 1. Select pacakges:
 *      - .(root)
 *      - a
 *      - b
 * 2. Which files to commit:
 *      - .(root): haha.js
 *      - myreactapp: apps/myreactapp/index.js
 * 3. Select type: feat, chore ...
 * 4. Input commit message: add a new feature
 */
class View {
  private onCancelPrompts() {
    process.exit(0);
  }

  async askCommitStagedFiles(commitableFiles: File[]): Promise<boolean> {
    const hint = commitableFiles.map((file) => file.filePath).join("\n");

    console.log(`You have staged changes:
${chalk.dim.underline(hint)}
`);

    const res = await prompts(
      {
        type: "toggle",
        name: "value",
        message: "Commit first?",
        initial: true,
        active: "yes",
        inactive: "no",
      },
      { onCancel: this.onCancelPrompts },
    );
    return res.value;
  }

  async askSelectPacakges(packageNames: string[]): Promise<string[]> {
    const choices: Choice[] = packageNames.map((name) => ({
      title: name || ".(root)",
      value: name,
      selected: true,
    }));

    const res = await prompts(
      {
        name: "packages",
        type: "multiselect",
        message: "📦️ Select pacakges",
        hint: "- Space to toggle selection",
        choices,
        instructions: false,
      },
      { onCancel: this.onCancelPrompts },
    );

    return res.packages;
  }

  async askSelectFiles(files: File[]): Promise<File[]> {
    const choices: Choice[] = files.map((file) => ({
      title: `${file.filePath}`,
      description: file.fileName,
      value: file,
      selected: true,
    }));

    const res = await prompts(
      {
        name: "files",
        type: "multiselect",
        message: "📝 Which files to commit",
        hint: "- Space to toggle selection",
        choices,
        instructions: false,
      },
      { onCancel: this.onCancelPrompts },
    );

    return res.files;
  }

  async askPickCommitType(
    types: {
      emoji: string;
      type: string;
      title: string;
      description: string;
    }[],
  ): Promise<string> {
    const choices: Choice[] = types.map((type) => ({
      title: type.type,
      description: `${type.emoji} ${type.title}`,
      value: type.type,
    }));

    const res = await prompts(
      {
        name: "type",
        type: "autocomplete",
        message: "💎 Pick a commit type",
        choices,
        instructions: false,
      },
      { onCancel: this.onCancelPrompts },
    );

    return res.type;
  }

  async askInputDescription(): Promise<string> {
    const res = await prompts(
      {
        name: "description",
        type: "text",
        message: "💬 Input commit description",
      },
      { onCancel: this.onCancelPrompts },
    );

    return res.description;
  }
}

class Controller {
  constructor(
    private readonly model: Model,
    private readonly view: View,
  ) {}

  async run() {
    await this.model.scan();

    let commitFirst = false;

    const commitableFiles = this.model.getCommitableFiles();

    if (commitableFiles.length) {
      commitFirst = await this.view.askCommitStagedFiles(commitableFiles);
    }

    if (!commitFirst) {
      // 1.
      // const addablePackages = this.model.getAddablePackages();
      // const selectedPackages =
      //   await this.view.askSelectPacakges(addablePackages);
      // if (!selectedPackages.length) return;

      // 2.
      const files = this.model.getAddableFiles();
      const selectedFiles = await this.view.askSelectFiles(files);
      if (!selectedFiles.length) return;

      await this.model.add(selectedFiles);
    }

    // 3.
    const commitTypes = Object.entries(EMOJI_MAP).map(([type, info]) => ({
      type,
      ...info,
    }));
    const type = await this.view.askPickCommitType(commitTypes);

    // 4.
    const description = await this.view.askInputDescription();

    await this.model.commit(type, description);
    console.log("✅ Done!");
  }
}

if (import.meta.main) {
  const model = new Model();
  const view = new View();
  const controller = new Controller(model, view);
  controller.run();
}
