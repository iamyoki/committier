import { AiCommitMessage } from "../../../domain/ai-commit-message.ts";
import type { AiCommitGeneratorInterface } from "../../interfaces/ai-commit-generator.interface.ts";

export class AIGenerateUseCase {
  constructor(private readonly aiCommitGenerator: AiCommitGeneratorInterface) {}

  async execute(params?: {
    userIntent?: string | undefined;
    _diff?: string | undefined;
    onModelDownloadStart?: () => void;
    onModelDownloading?: (info: {
      file: string;
      MBSize: number;
      progress: number;
    }) => void;
    onModelDownloadEnd?: () => void;
    onTransformersInstall?: () => void;
  }): Promise<AiCommitMessage> {
    const aiCommitMessage = await this.aiCommitGenerator.execute(params);
    return aiCommitMessage;
  }
}
