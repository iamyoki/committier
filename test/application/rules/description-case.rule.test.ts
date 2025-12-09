import assert from "node:assert";
import { describe, it } from "node:test";
import { DescriptionCaseRule } from "../../../src/application/rules/conventional-commit-message-rules/description-case.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("description case rule", () => {
  it("convert description to lower case", () => {
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat", description: "A new feature" },
    };
    const rule = new DescriptionCaseRule();
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "a new feature");
  });
});
