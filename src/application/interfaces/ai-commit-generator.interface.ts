import type { AiCommitMessage } from "../../domain/ai-commit-message.ts";

export interface AiCommitGeneratorInterface {
  execute(params?: {
    userIntent?: string;
    _diff?: string;
  }): Promise<AiCommitMessage>;
}
