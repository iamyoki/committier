import { readFile } from "fs/promises";
import path from "path";
import { AiCommitGenerator } from "../../src/infrastructure/ai-commit-generator.ts";

const diff = await readFile(
  path.join(import.meta.dirname, "./diff-1.txt"),
  "utf8",
);

const aiCommitGenerator = new AiCommitGenerator();
const aiCommitMessage = await aiCommitGenerator.execute({
  userIntent: "",
  _diff: diff,
});
console.log(aiCommitMessage);
