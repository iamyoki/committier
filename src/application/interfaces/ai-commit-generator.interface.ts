import type { AiCommitMessage } from "../../domain/ai-commit-message.ts";

export interface AiCommitGeneratorInterface {
  execute(params?: {
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
  }): Promise<AiCommitMessage>;
}
