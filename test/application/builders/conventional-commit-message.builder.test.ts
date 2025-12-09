import assert from "node:assert";
import { describe, it } from "node:test";
import { ConventionalCommitMessageBuilder } from "../../../src/application/builders/conventional-commit-message.builder.ts";
import type { ConventionalCommitMessageParsedDataType } from "../../../src/application/types/conventional-commit-message-parsed-data.type.ts";
import type { CommitMessageParserInterface } from "../../../src/domain/interfaces/commit-message.parser.interface.ts";

class MockParser
  implements
    CommitMessageParserInterface<ConventionalCommitMessageParsedDataType>
{
  parse(__raw: string): ConventionalCommitMessageParsedDataType {
    return {
      header: {
        type: "feat",
        emoji: "✨",
        scope: ["foo"],
        description: "a new feature",
        breakingChangeMark: undefined,
      },
      bodies: [],
      footers: [],
    };
  }
}

describe("conventional commit message builder", () => {
  it("applyRules and build a commit message", async () => {
    const builder = new ConventionalCommitMessageBuilder(
      "feat(foo): a new feature",
      new MockParser(),
    );
    await builder.applyRules([]);
    const commitMessage = builder.build();
    assert.strictEqual(commitMessage.toString(), "✨ feat(foo): a new feature");
  });
});
