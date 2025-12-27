import type { AiCommitMessage } from "../../domain/ai-commit-message.ts";

export interface AiCommitGeneratorInterface {
  execute(params?: {
    userIntent?: string | undefined;
    _diff?: string | undefined;
  }): Promise<AiCommitMessage>;
}
