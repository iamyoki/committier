import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

/**
 * "add a button\nadd another button"
 * => "add a button. Add another button"
 */
export class DescriptionNoBreaksRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "descriptionNoBreaks";

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;
    if (header.description.indexOf("\n") !== -1) {
      const splits = header.description.split(/\n/).filter((w) => !!w);
      const [firstWord, ...restWords] = splits;
      const formatRestWords = restWords.map((w) =>
        w[0] ? w[0].toUpperCase() + w.slice(1) : "",
      );
      header.description = [firstWord, ...formatRestWords].join(". ");
    }
  }
}
