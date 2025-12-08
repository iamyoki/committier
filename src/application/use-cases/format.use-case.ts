import { ConventionalCommitMessageBuilder } from "../builders/conventional-commit-message.builder.ts";
import { ConventionalCommitMessageParser } from "../parsers/conventional-commit-message.parser.ts";
import { DescriptionCaseRule } from "../rules/conventional-commit-message-rules/description-case.rule.ts";
import { DescriptionNoBreaksRule } from "../rules/conventional-commit-message-rules/description-no-breaks.rule.ts";
import { EmojiRule } from "../rules/conventional-commit-message-rules/emoji.rule.ts";
import { FallbackTypeRule } from "../rules/conventional-commit-message-rules/fallback-type.rule.ts";
import { ScopeCaseRule } from "../rules/conventional-commit-message-rules/scope-case.rule.ts";
import { TypeCaseRule } from "../rules/conventional-commit-message-rules/type-case.rule.ts";
import type { ConventionalCommitMessageConfigType } from "../types/conventional-commit-message-config.type.ts";

export class FormatUseCase {
  constructor(private readonly config: ConventionalCommitMessageConfigType) {}

  execute(rawMessage: string): string {
    const rules = [
      new TypeCaseRule(),
      new ScopeCaseRule(),
      new FallbackTypeRule(this.config),
      new DescriptionCaseRule(),
      new DescriptionNoBreaksRule(),
      new EmojiRule(this.config),
    ];

    const parser = new ConventionalCommitMessageParser();
    const builder = new ConventionalCommitMessageBuilder(rawMessage, parser);

    builder.applyRules(rules);
    const commitMessage = builder.build();
    return commitMessage.toString();
  }
}
