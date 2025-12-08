import type { CommitFile } from "../../../domain/commit-file.ts";
import type { FormatRuleInterface } from "../../../domain/interfaces/format-rule.interface.ts";
import type { ConfigType } from "../../types/config.type.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../types/conventional-commit-message-parsed-data.type.ts";

export class InferScopeRule
  implements FormatRuleInterface<ConventionalCommitMessageParsedDataType>
{
  ruleName: string = "inferScope";

  constructor(
    private readonly config: ConfigType,
    private readonly commitFiles: CommitFile[] | undefined,
  ) {}

  apply(parsedData: ConventionalCommitMessageParsedDataType): void {
    if (
      this.commitFiles &&
      this.commitFiles.length > 0 &&
      this.config.autoScope
    ) {
      const { header } = parsedData;

      if (
        this.config.autoScope === "defaultToPackageName" &&
        header.scope?.length
      ) {
        return;
      }

      const packageNames = this.commitFiles.map(
        (f) => f.packageNameWithoutScope,
      ) as string[];

      const dedupPackageNames = Array.from(new Set(packageNames));
      header.scope = dedupPackageNames;
    }
  }
}
