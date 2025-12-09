import assert from "node:assert";
import { describe, it } from "node:test";
import type { ConfigLoaderInterface } from "../../src/application/interfaces/config-loader.interface.ts";
import { ConfigService } from "../../src/application/services/config.service.ts";
import { CommitFile } from "../../src/domain/commit-file.ts";
import { FormatUseCase } from "../../src/index.ts";

const fixtures = {
  commitFiles1: [
    CommitFile.create("a/b.js", "@foo/bar", false, false),
    CommitFile.create("c/d.js", "@foo/bar", false, false),
    CommitFile.create("e/f.js", "@foo/eel", false, false),
  ],
};

const cases = [
  {
    rawMessage: " some error",
    expected: "🐛 fix: some error",
    userConfig: {},
  },
  {
    rawMessage: " some error",
    expected: "fix: some error",
    userConfig: { autoEmoji: false },
  },
  {
    rawMessage: " some error",
    expected: "chore: some error",
    userConfig: { autoEmoji: false, defaultType: "chore" },
  },
  {
    rawMessage: " some error",
    expected: "chore(bar,eel): some error",
    commitFiles: fixtures.commitFiles1,
    userConfig: { autoEmoji: false, autoScope: true, defaultType: "chore" },
  },
  {
    rawMessage: "fix(app, lib):some error",
    expected: "fix(bar,eel): some error",
    commitFiles: fixtures.commitFiles1,
    userConfig: { autoEmoji: false, autoScope: "replaceToPackageName" },
  },
  {
    rawMessage: "feat: add button",
    expected: "✨ feat: add button",
    userConfig: {},
    commitFiles: [],
  },
  {
    rawMessage: "feat: add button",
    expected: "😀 feat: add button",
    userConfig: { types: { feat: { emoji: "😀" } } },
    commitFiles: [],
  },
  {
    rawMessage: "feat add button",
    expected: "✨ feat: add button",
    userConfig: {},
  },
  {
    rawMessage: " FEAT    add button",
    expected: "✨ feat: add button",
    userConfig: {},
  },
  {
    rawMessage: " app1,app2 some bugs",
    expected: "🐛 fix(app1,app2): some bugs",
    userConfig: {},
  },
  {
    rawMessage: " app1, app2 : some bugs",
    expected: "🐛 fix(app1,app2): some bugs",
    userConfig: {},
  },
  {
    rawMessage: " (app1 app2 ) : some bugs",
    expected: "🐛 fix(app1,app2): some bugs",
    userConfig: {},
  },
];

describe("format", () => {
  cases.forEach(({ rawMessage, expected, commitFiles = [], userConfig }) => {
    it(`formats "${rawMessage}"`, async () => {
      const configLoader = {
        load() {
          return userConfig;
        },
      };
      const configService = new ConfigService(
        configLoader as ConfigLoaderInterface,
      );
      const config = await configService.getConfig();
      const formatUseCase = new FormatUseCase(config);
      const finalMessage = await formatUseCase.execute({
        rawMessage,
        commitFiles,
      });
      assert.strictEqual(finalMessage, expected);
    });
  });
});
