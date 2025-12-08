import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConfigType } from "../../types/config.type.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class FallbackTypeRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "fallbackType";

  constructor(private readonly config: ConfigType) {}

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    header.type ||= this.config.defaultType;
    if (!(header.type in this.config.types)) {
      header.description = `${header.type} ${header.description}`;
      header.type = this.config.defaultType;
    }
  }
}
