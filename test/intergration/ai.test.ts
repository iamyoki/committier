import { spinner } from "@clack/prompts";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { AiCommitMessage } from "../../src/domain/ai-commit-message.ts";
import { AiCommitGenerator } from "../../src/infrastructure/ai-commit-generator.ts";
import { AiCommitGeneratorWorker } from "../../src/infrastructure/ai-commit-generator.worker.ts";

describe.skip("ai", () => {
  it("should generate commit message", async () => {
    const diff = await readFile(
      path.join(import.meta.dirname, "./fixtures/diff-1.txt"),
      "utf8",
    );

    const aiCommitGenerator = new AiCommitGenerator();
    const aiCommitMessage = await aiCommitGenerator.execute({
      userIntent: "",
      _diff: diff,
    });
    console.log(aiCommitMessage);
    assert.ok(aiCommitMessage instanceof AiCommitMessage);
  });
});

describe.skip("ai - worker", () => {
  it("should generate commit message", async () => {
    const diff = await readFile(
      path.join(import.meta.dirname, "./fixtures/diff-1.txt"),
      "utf8",
    );

    const aiCommitGenerator = new AiCommitGeneratorWorker();
    const s = spinner({ indicator: "timer" });
    s.start("Ai commit message generating");
    const aiCommitMessage = await aiCommitGenerator.execute({
      userIntent: "",
      _diff: diff,
    });
    s.stop("Done");
    console.log(aiCommitMessage);
    assert.ok(aiCommitMessage instanceof AiCommitMessage);
  });
});
