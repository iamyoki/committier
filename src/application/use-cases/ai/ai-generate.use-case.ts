import { AiCommitMessage } from "../../../domain/ai-commit-message.ts";
import type { AiCommitGeneratorInterface } from "../../interfaces/ai-commit-generator.interface.ts";

export class AIGenerateUseCase {
  constructor(private readonly aiCommitGenerator: AiCommitGeneratorInterface) {}

  async execute(userIntent?: string, _diff?: string): Promise<AiCommitMessage> {
    const aiCommitMessage = await this.aiCommitGenerator.execute({
      userIntent,
      _diff,
    });
    return aiCommitMessage;
  }
}
