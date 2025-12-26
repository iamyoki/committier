import type {
  ProgressInfo,
  TextGenerationPipeline,
} from "@huggingface/transformers";
import { execSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { detect, resolveCommand } from "package-manager-detector";
import { simpleGit } from "simple-git";
import type { AiCommitGeneratorInterface } from "../application/interfaces/ai-commit-generator.interface.ts";
import { AiCommitMessage } from "../domain/ai-commit-message.ts";

export class AiCommitGenerator implements AiCommitGeneratorInterface {
  static CONFIG = {
    modelCacheDir: path.join(homedir(), ".committier", "models"),
    modelId: "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
    dtype: "q4",
    device: "auto",
    temperature: 0.1,
    top_p: 0.9,
    max_new_tokens: 380,
    return_full_text: false,
  } as const;

  private transformers: typeof import("@huggingface/transformers") | undefined;

  private readonly git = simpleGit();

  constructor(
    private readonly props?: {
      onModelDownloadStart?: () => void;
      onModelDownloading?: (info: {
        file: string;
        MBSize: number;
        progress: number;
      }) => void;
      onModelDownloadEnd?: () => void;
      onTransformersInstall?: () => void;
    },
  ) {}

  async execute(params?: {
    userIntent?: string;
    _diff?: string;
  }): Promise<AiCommitMessage> {
    try {
      await this.ensureModelCacheDir();
    } catch {
      throw new Error("Model cache dir creation failed");
    }

    try {
      await this.ensureTransformersInstalled();
      if (!this.transformers) throw new Error();
    } catch {
      throw new Error("Transformers installation failed");
    }

    const pipe = await this.createPipe();

    const diff = params?._diff ?? (await this.diff());
    if (!diff) throw new Error("No staged diff info");

    // await writeFile(path.join(process.cwd(), "diff.txt"), diff, "utf8");

    const systemPrompt = await this.getSystemPrompt();

    const config = AiCommitGenerator.CONFIG;

    const out = (await pipe(
      [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Diff:\n${diff}\n\nUser Itent:\n${params?.userIntent ?? ""}`,
        },
      ],
      {
        temperature: config.temperature,
        top_p: config.top_p,
        max_new_tokens: config.max_new_tokens,
        return_full_text: config.return_full_text,
      },
    )) as unknown as { generated_text: { role: string; content: string }[] }[];

    const response = out[0]!.generated_text.at(-1)!;

    const json = this.formatToJSON(response.content);

    const aiCommitMessage = AiCommitMessage.create(
      json.type,
      json.description,
      json.body,
    );

    return aiCommitMessage;
  }

  private async ensureModelCacheDir() {
    await mkdir(AiCommitGenerator.CONFIG.modelCacheDir, { recursive: true });
  }

  private async ensureTransformersInstalled() {
    try {
      this.transformers = await import("@huggingface/transformers");
    } catch {
      // install for user

      // detect package manager
      const pm = await detect();
      if (!pm) throw new Error("Could not detect package manager");

      const resolved = resolveCommand(pm.agent, "add", [
        "@huggingface/transformers",
      ]);
      if (!resolved) throw new Error("Cannot detect package manager");

      // install
      this.props?.onTransformersInstall?.();
      const { command, args } = resolved;
      // const s = spinner();
      // s.start(`Installing @huggingface/transformers via ${pm.name}`);
      execSync(`${command} ${args}`);
      // s.stop(`Installed @huggingface/transformers`);

      // set transformers
      this.transformers = await import("@huggingface/transformers");
    }
  }

  private async createPipe(): Promise<TextGenerationPipeline> {
    const config = AiCommitGenerator.CONFIG;
    try {
      const pipe = await this.transformers!.pipeline(
        "text-generation",
        AiCommitGenerator.CONFIG.modelId,
        {
          cache_dir: config.modelCacheDir,
          dtype: config.dtype,
          device: config.device,
          progress_callback: (info) => this.handleProgress(info),
        },
      );
      return pipe;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Load model")) {
        // clear model, tell use try again
        await rm(config.modelCacheDir, { force: true, recursive: true });
        throw new Error("Load model failed, please try again later.");
      }
      throw error;
    }
  }

  private async handleProgress(info: ProgressInfo) {
    switch (info.status) {
      case "progress": {
        const MBSize = info.total / 1024 / 1024;
        if (MBSize > 50 && this.props?.onModelDownloading) {
          this.props.onModelDownloading({
            file: info.file,
            MBSize,
            progress: +info.progress.toFixed(2),
          });
        } else {
          this.props?.onModelDownloadStart?.();
        }
        break;
      }
      case "done": {
        this.props?.onModelDownloadEnd?.();
        break;
      }
    }
  }

  private async diff(): Promise<string | undefined> {
    const info = await this.git.diff([
      "--staged",
      "--patch-with-stat",
      "--unified=1",
      "--no-prefix",
      "--ignore-all-space",
      "--",
      ":!*-lock.yaml",
      ":!package-lock.json",
      ":!yarn.lock",
      ":!*.log",
    ]);
    if (!info || !info.length) return undefined;
    return info;
  }

  private async getSystemPrompt(): Promise<string> {
    return await readFile(
      path.join(import.meta.dirname, "./prompts/ai-commit.prompt.md"),
      "utf8",
    );
  }

  private formatToJSON(content: string) {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Failed matching generated content");
    return JSON.parse(match[0]);
  }
}
