import assert from "node:assert";
import { describe, it } from "node:test";
import { FallbackTypeRule } from "../../../src/application/rules/conventional-commit-message-rules/fallback-type.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";
import type { ConfigType } from "../../../src/index.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("fallback type rule", () => {
  it("fill a default type from config if no type provided", () => {
    const config: PartialDeep<ConfigType> = {
      defaultType: "feat",
      types: { feat: {} },
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "" },
    };
    const rule = new FallbackTypeRule(config as ConfigType);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.type, "feat");
  });
});
