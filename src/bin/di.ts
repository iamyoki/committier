import { ConfigService } from "../application/services/config.service.ts";
import type { ConfigType } from "../application/types/config.type.ts";
import { AddFilesUseCase } from "../application/use-cases/add-files.use-case.ts";
import { AIGenerateUseCase } from "../application/use-cases/ai/ai-generate.use-case.ts";
import { CommitFilesUseCase } from "../application/use-cases/commit-files.use-case.ts";
import { EditUseCase } from "../application/use-cases/edit.use-case.ts";
import { FormatUseCase } from "../application/use-cases/format.use-case.ts";
import { GetCommitFilesUseCase } from "../application/use-cases/get-commit-files.use-case.ts";
import { AiCommitGenerator } from "../infrastructure/ai-commit-generator.ts";
import { CosmiconfigConfigLoader } from "../infrastructure/cosmiconfig-config-loader.ts";
import { FsCommitMsgFile } from "../infrastructure/fs-commit-msg-file.ts";
import { GitCommitFileRepository } from "../infrastructure/git-commit-file.repository.ts";
import { Git } from "../infrastructure/git.ts";
import { AiPrompt } from "../presentation/ai-prompt.ts";
import { CommitPrompt } from "../presentation/commit-prompt.ts";
import { GitHook } from "../presentation/git-hook.ts";

export async function getConfig(): Promise<ConfigType> {
  const configLoader = new CosmiconfigConfigLoader();
  const configService = new ConfigService(configLoader);
  return configService.getConfig();
}

export function di(config: ConfigType) {
  const infras = {
    commitFileRepository: new GitCommitFileRepository(
      !!config.autoScope || !!config.defaultDescription,
    ),
    git: new Git(),
    commitMsgFile: new FsCommitMsgFile(),
    aiCommitGenerator: new AiCommitGenerator(),
  };

  const useCases = {
    addFilesUseCase: new AddFilesUseCase(
      infras.git,
      infras.commitFileRepository,
    ),
    getCommitFilesUseCase: new GetCommitFilesUseCase(
      infras.commitFileRepository,
    ),
    commitFilesUseCase: new CommitFilesUseCase(
      infras.git,
      infras.commitFileRepository,
    ),
    editUseCase: new EditUseCase(infras.commitMsgFile),
    formatUseCase: new FormatUseCase(config),
    aiGenerateUseCase: new AIGenerateUseCase(infras.aiCommitGenerator),
  };

  const presenters = {
    gitHook: new GitHook(
      infras.commitMsgFile,
      useCases.getCommitFilesUseCase,
      useCases.formatUseCase,
      useCases.editUseCase,
    ),
    commitPrompt: new CommitPrompt(
      config,
      useCases.getCommitFilesUseCase,
      useCases.addFilesUseCase,
      useCases.commitFilesUseCase,
      useCases.formatUseCase,
    ),
    aiPrompt: new AiPrompt(
      useCases.aiGenerateUseCase,
      useCases.formatUseCase,
      useCases.getCommitFilesUseCase,
      useCases.commitFilesUseCase,
    ),
  };

  return {
    infras,
    useCases,
    presenters,
  };
}
