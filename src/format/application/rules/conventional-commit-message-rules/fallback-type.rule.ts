import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

/**Default fallback to "fix" */
export type FallbackTypeRuleOptions = {
  defaultType: string;
};

export class FallbackTypeRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "fallbackType";

  constructor(
    private readonly options: FallbackTypeRuleOptions = { defaultType: "fix" },
  ) {}

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    header.type ||= this.options.defaultType;
  }
}
