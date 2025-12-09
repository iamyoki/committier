import type { CommitFile } from "../../domain/commit-file.ts";
import { ConventionalCommitMessageBuilder } from "../builders/conventional-commit-message.builder.ts";
import { ConventionalCommitMessageParser } from "../parsers/conventional-commit-message.parser.ts";
import { DefaultDescriptionRule } from "../rules/conventional-commit-message-rules/default-description.rule.ts";
import { DescriptionCaseRule } from "../rules/conventional-commit-message-rules/description-case.rule.ts";
import { DescriptionNoBreaksRule } from "../rules/conventional-commit-message-rules/description-no-breaks.rule.ts";
import { EmojiRule } from "../rules/conventional-commit-message-rules/emoji.rule.ts";
import { FallbackTypeRule } from "../rules/conventional-commit-message-rules/fallback-type.rule.ts";
import { InferScopeRule } from "../rules/conventional-commit-message-rules/infer-scope.rule.ts";
import { ScopeCaseRule } from "../rules/conventional-commit-message-rules/scope-case.rule.ts";
import { TypeCaseRule } from "../rules/conventional-commit-message-rules/type-case.rule.ts";
import type { ConventionalCommitMessageConfigType } from "../types/conventional-commit-message-config.type.ts";

export class FormatUseCase {
  constructor(private readonly config: ConventionalCommitMessageConfigType) {}

  async execute(context: {
    rawMessage: string;
    commitFiles?: CommitFile[];
  }): Promise<string> {
    const parser = new ConventionalCommitMessageParser();
    const builder = new ConventionalCommitMessageBuilder(
      context.rawMessage,
      parser,
    );

    const rules = [
      new TypeCaseRule(),
      new FallbackTypeRule(this.config),
      new ScopeCaseRule(),
      new InferScopeRule(this.config, context.commitFiles),
      new DefaultDescriptionRule(this.config, context.commitFiles),
      new DescriptionCaseRule(),
      new DescriptionNoBreaksRule(),
      new EmojiRule(this.config),
    ];

    await builder.applyRules(rules);
    const commitMessage = builder.build();
    return commitMessage.toString();
  }
}
