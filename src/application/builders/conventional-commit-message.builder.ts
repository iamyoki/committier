import { CommitMessage } from "../../domain/commit-message.js";
import type { CommitMessageBuilderInterface } from "../../domain/interfaces/commit-message.builder.interface.ts";
import type { CommitMessageParserInterface } from "../../domain/interfaces/commit-message.parser.interface.ts";
import type { FormatRuleInterface } from "../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../types/conventional-commit-message-parsed-data.type.ts";

export class ConventionalCommitMessageBuilder
  implements
    CommitMessageBuilderInterface<ConventionalCommitMessageParsedDataType>
{
  data: ConventionalCommitMessageParsedDataType;

  constructor(
    private readonly raw: string,
    private readonly parser: CommitMessageParserInterface<typeof this.data>,
  ) {
    this.data = this.parser.parse(this.raw);
  }

  async applyRules(
    formatRules: FormatRuleInterface<ConventionalCommitMessageParsedDataType>[],
  ): Promise<void> {
    for (const rule of formatRules) {
      await rule.apply(this.data);
    }
  }

  build(): CommitMessage {
    const { emoji, type, scope, breakingChangeMark, description } =
      this.data.header;
    let header = "";

    if (emoji) header += emoji + " ";
    if (type) header += type;
    if (scope) header += `(${scope.join(",")})`;
    if (breakingChangeMark) header += breakingChangeMark;
    if (description) header += `: ${description}`;

    return CommitMessage.create(header, this.data.bodies, this.data.footers);
  }
}
