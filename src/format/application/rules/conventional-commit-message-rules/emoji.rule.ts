import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageConfigType } from "../../types/conventional-commit-message-config.type.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export type EmojiRuleOptions =
  /** Replace existing emoji to config type's emoji */
  | "replace"

  /** Set emoji to config type's emoji if no presents */
  | "fallback";

export class EmojiRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "emoji";

  constructor(
    private readonly options: EmojiRuleOptions = "replace",
    private readonly config: ConventionalCommitMessageConfigType,
  ) {}

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;

    const type =
      this.config.types[
        header.type as keyof ConventionalCommitMessageConfigType["types"]
      ];

    if (!type) return;

    if (
      this.options === "replace" ||
      (this.options === "fallback" && !header.emoji)
    ) {
      header.emoji = type.emoji;
      if (type.scopes) {
        for (const scope of type.scopes) {
          if (
            header.scope?.some((s) =>
              typeof scope.match === "string"
                ? scope.match === s
                : scope.match.test(s),
            )
          ) {
            header.emoji = scope.emoji;
            break;
          }
        }
      }
    }
  }
}
