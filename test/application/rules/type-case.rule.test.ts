import assert from "node:assert";
import { describe, it } from "node:test";
import { TypeCaseRule } from "../../../src/application/rules/conventional-commit-message-rules/type-case.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("type case rule", () => {
  it("convert type to lower case", () => {
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "FeAt" },
    };
    const rule = new TypeCaseRule();
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.type, "feat");
  });
});
