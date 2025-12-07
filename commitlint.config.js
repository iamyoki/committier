import { commitlintEmojiParser } from "./commitlint-emoji-parser.js";

export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: commitlintEmojiParser,
};
