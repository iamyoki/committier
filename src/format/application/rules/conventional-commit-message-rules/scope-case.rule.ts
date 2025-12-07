import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class ScopeCaseRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "scopeCase";

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    if (header.scope) {
      header.scope = header.scope.map((s) => s.toLowerCase());
    }
  }
}
