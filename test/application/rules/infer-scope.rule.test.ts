import assert from "node:assert";
import { describe, it } from "node:test";
import { InferScopeRule } from "../../../src/application/rules/conventional-commit-message-rules/infer-scope.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";
import { CommitFile } from "../../../src/domain/commit-file.ts";
import type { ConfigType } from "../../../src/index.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("infer scope rule", () => {
  it("should infer scope from commit files package names", () => {
    const config: PartialDeep<ConfigType> = { autoScope: true };
    const commitFiles = [
      CommitFile.create("a/b.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { scope: ["APP", "LIb"] },
    };

    const rule = new InferScopeRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.deepStrictEqual(data.header?.scope, ["bar", "eel"]);

    data.header.scope = ["app", "lib"];
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.deepStrictEqual(data.header?.scope, ["bar", "eel"]);
  });

  it("should infer scope if no scope provided and config is defaultToPackageName", () => {
    const config: PartialDeep<ConfigType> = {
      autoScope: "defaultToPackageName",
    };
    const commitFiles = [
      CommitFile.create("a/b.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { scope: undefined },
    };

    const rule = new InferScopeRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.deepStrictEqual(data.header?.scope, ["bar", "eel"]);

    data.header.scope = ["app", "lib"];
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.deepStrictEqual(data.header?.scope, ["app", "lib"]);
  });
});
