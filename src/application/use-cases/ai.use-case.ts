import { AiCommitMessage } from "../../domain/ai-commit-message.js";
import type { AiCommitGeneratorInterface } from "../interfaces/ai-commit-generator.interface.ts";

export class AiUseCase {
  constructor(private readonly aiCommitGenerator: AiCommitGeneratorInterface) {}

  async execute(userIntent?: string): Promise<AiCommitMessage> {
    const aiCommitMessage = await this.aiCommitGenerator.execute({
      userIntent,
    });
    return aiCommitMessage;
  }
}
