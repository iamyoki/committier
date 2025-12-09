import assert from "node:assert";
import { describe, it } from "node:test";
import { ConventionalCommitMessageParser } from "../../../src/application/parsers/conventional-commit-message.parser.ts";

const cases = [
  {
    message: "some error",
    expected: {
      header: { type: "some", description: "error" },
    },
  },
  {
    message: ":some error",
    expected: { header: { type: undefined, description: "some error" } },
  },
  {
    message: ": some error",
    expected: {
      header: { type: undefined, description: "some error" },
    },
  },
  {
    message: "!: some error",
    expected: {
      header: {
        type: undefined,
        breakingChangeMark: "!",
        description: "some error",
      },
    },
  },
  {
    message: "feat",
    expected: { header: { type: "feat", description: "" } },
  },
  {
    message: "✨feat",
    expected: { header: { emoji: "✨", type: "feat", description: "" } },
  },
  {
    message: "feat add button",
    expected: { header: { type: "feat", description: "add button" } },
  },
  {
    message: ": add button",
    expected: { header: { type: undefined, description: "add button" } },
  },
  {
    message: "feat : add button",
    expected: { header: { type: "feat", description: "add button" } },
  },
  {
    message: "feat(app1): add button",
    expected: {
      header: { type: "feat", scope: ["app1"], description: "add button" },
    },
  },
  {
    message: "feat (app1): add button",
    expected: {
      header: { type: "feat", scope: ["app1"], description: "add button" },
    },
  },
  {
    message: "feat (app1,app2): add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 , app2): add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 app2): add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 app2) add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 app2)! add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        breakingChangeMark: "!",
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 app2)!: add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        breakingChangeMark: "!",
        description: "add button",
      },
    },
  },
  {
    message: "feat (app1 app2) !: add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        breakingChangeMark: "!",
        description: "add button",
      },
    },
  },
  {
    message: "feat app1: add button",
    expected: {
      header: { type: "feat", scope: ["app1"], description: "add button" },
    },
  },
  {
    message: "feat app1!: add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1"],
        breakingChangeMark: "!",
        description: "add button",
      },
    },
  },
  {
    message: "feat app1, add button",
    expected: {
      header: { type: "feat", scope: ["app1"], description: "add button" },
    },
  },
  {
    message: "feat app1,app2 add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2"],
        description: "add button",
      },
    },
  },
  {
    message: "feat app1,  app2,app3: add button",
    expected: {
      header: {
        type: "feat",
        scope: ["app1", "app2", "app3"],
        description: "add button",
      },
    },
  },
  {
    message: "feat app1,  app2,app3! add button",
    expected: {
      header: {
        type: "feat",
        breakingChangeMark: "!",
        scope: ["app1", "app2", "app3"],
        description: "add button",
      },
    },
  },
  {
    message: "feat app1,  app2,app3 !: add button",
    expected: {
      header: {
        type: "feat",
        breakingChangeMark: "!",
        scope: ["app1", "app2", "app3"],
        description: "add button",
      },
    },
  },
  {
    message: "feat: add button\nBody message",
    expected: {
      header: { type: "feat", description: "add button" },
      bodies: ["Body message"],
    },
  },
  {
    message: "feat: add button\nBody pragraph-1-line-1\nBody pragraph-1-line-2",
    expected: {
      bodies: ["Body pragraph-1-line-1\nBody pragraph-1-line-2"],
    },
  },
  {
    message:
      "feat: add button\nBody pragraph-1-line-1\nBody pragraph-1-line-2\n\nFooter pragraph-1-line-1",
    expected: {
      bodies: ["Body pragraph-1-line-1\nBody pragraph-1-line-2"],
      footers: ["Footer pragraph-1-line-1"],
    },
  },
  {
    message:
      "feat: add button\nBody pragraph-1-line-1\nBody pragraph-1-line-2\n\nBody paragraph-2-line-1\n\nFooter pragraph-1-line-1",
    expected: {
      bodies: [
        "Body pragraph-1-line-1\nBody pragraph-1-line-2",
        "Body paragraph-2-line-1",
      ],
      footers: ["Footer pragraph-1-line-1"],
    },
  },
];

describe("conventional commit message parser", () => {
  describe("should parse correctly", () => {
    cases.forEach(({ message, expected }) => {
      it(`parse message "${message.replaceAll("\n", "\\n")}"`, () => {
        const parser = new ConventionalCommitMessageParser();
        const data = parser.parse(message);
        assert.partialDeepStrictEqual(data, expected);
      });
    });
  });
});
