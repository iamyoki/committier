import assert from "node:assert";
import { describe, it } from "node:test";
import { DescriptionNoBreaksRule } from "../../../src/application/rules/conventional-commit-message-rules/description-no-breaks.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("description no breaks rule", () => {
  it("formats into one line", () => {
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat", description: "hello\nWorld" },
    };
    const rule = new DescriptionNoBreaksRule();
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "hello. World");
  });
});
