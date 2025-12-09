import assert from "node:assert";
import { describe, it } from "node:test";
import { DefaultDescriptionRule } from "../../../src/application/rules/conventional-commit-message-rules/default-description.rule.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";
import { CommitFile } from "../../../src/domain/commit-file.ts";
import type { ConfigType } from "../../../src/index.ts";

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

describe("default description rule", () => {
  it("auto infer desc from file name", () => {
    const config: PartialDeep<ConfigType> = {
      defaultDescription: true,
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat" },
    };
    const commitFiles = [
      CommitFile.create("a/b.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const rule = new DefaultDescriptionRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "b.js, d.js, f.js");
  });

  it("add 'up' if file name starts with upper case", () => {
    const config: PartialDeep<ConfigType> = {
      defaultDescription: true,
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat" },
    };
    const commitFiles = [
      CommitFile.create("a/Button.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const rule = new DefaultDescriptionRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "up Button.js, d.js, f.js");
  });

  it("auto infer desc from file base name", () => {
    const config: PartialDeep<ConfigType> = {
      defaultDescription: "fileBasename",
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat" },
    };
    const commitFiles = [
      CommitFile.create("a/b.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const rule = new DefaultDescriptionRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "b, d, f");
  });

  it("auto infer desc from file path", () => {
    const config: PartialDeep<ConfigType> = {
      defaultDescription: "filePath",
    };
    const data: PartialDeep<ConventionalCommitMessageParsedDataType> = {
      header: { type: "feat" },
    };
    const commitFiles = [
      CommitFile.create("a/b.js", "@foo/bar", false, false),
      CommitFile.create("c/d.js", "@foo/bar", false, false),
      CommitFile.create("e/f.js", "@foo/eel", false, false),
    ];
    const rule = new DefaultDescriptionRule(config as ConfigType, commitFiles);
    rule.apply(data as ConventionalCommitMessageParsedDataType);
    assert.strictEqual(data.header?.description, "a/b.js, c/d.js, e/f.js");
  });
});
