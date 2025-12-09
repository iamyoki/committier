import assert from "node:assert";
import { describe, it } from "node:test";
import { EmojiRule } from "../../../src/application/rules/conventional-commit-message-rules/emoji.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";
import type { ConfigType } from "../../../src/index.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("emoji rule", () => {
  it("auto infer an emoji from type", () => {
    const config: PartialDeep<ConfigType> = {
      autoEmoji: true,
      types: { feat: { emoji: "😀" } },
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat" },
    };
    const rule = new EmojiRule(config as ConfigType);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.emoji, "😀");
  });

  it("auto infer an emoji from scope", () => {
    const config: PartialDeep<ConfigType> = {
      autoEmoji: true,
      types: { feat: { emoji: "😀", scopes: [{ match: "app", emoji: "🔮" }] } },
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat", scope: ["app"] },
    };
    const rule = new EmojiRule(config as ConfigType);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.emoji, "🔮");
  });
});
