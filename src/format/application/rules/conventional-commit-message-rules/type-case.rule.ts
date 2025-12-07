import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class TypeCaseRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "typeCase";

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    if (header.type) {
      header.type = header.type.toLowerCase();
    }
  }
}
