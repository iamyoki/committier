import type { CommitFile } from "../../../domain/commit-file.ts";
import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConfigType } from "../../types/config.type.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class DefaultDescriptionRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "defaultDescription";

  constructor(
    private readonly config: ConfigType,
    private readonly commitFiles: CommitFile[] | undefined,
  ) {}

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    const { header } = parsedData;

    if (header.description) return;
    if (!this.config.defaultDescription) return;
    if (!this.commitFiles?.length) return;

    switch (this.config.defaultDescription) {
      case true: {
        header.description = this.commitFiles.map((f) => f.fileName).join(", ");
        break;
      }
      case "fileName": {
        header.description = this.commitFiles.map((f) => f.fileName).join(", ");
        break;
      }
      case "fileBasename": {
        header.description = this.commitFiles
          .map((f) => f.fileBaseName)
          .join(", ");
        break;
      }
      case "filePath": {
        header.description = this.commitFiles.map((f) => f.filePath).join(", ");
        break;
      }
    }

    if (/^[A-Z]/.test(header.description)) {
      header.description = `up ${header.description}`;
    }
  }
}
