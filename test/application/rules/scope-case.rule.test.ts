import assert from "node:assert";
import { describe, it } from "node:test";
import { ScopeCaseRule } from "../../../src/application/rules/conventional-commit-message-rules/scope-case.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("scope case rule", () => {
  it("convert scope to lower case", () => {
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { scope: ["APP", "LIb"] },
    };
    const rule = new ScopeCaseRule();
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.deepStrictEqual(data.header?.scope, ["app", "lib"]);
  });
});
