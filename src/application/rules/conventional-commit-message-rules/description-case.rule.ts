import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class DescriptionCaseRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "descriptionCase";

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    if (header.description) {
      header.description =
        header.description[0]?.toLowerCase() + header.description.slice(1);
    }
  }
}
