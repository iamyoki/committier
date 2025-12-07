import { readFileSync, writeFileSync } from "node:fs";
import { EMOJI_MAP } from "./constants.js";

if (import.meta.main) {
  (async function () {
    const commitMessageFilePath = process.argv[2];
    if (!commitMessageFilePath) throw new Error("Cannot read commit message");

    const commitMessage = readFileSync(commitMessageFilePath, "utf8");

    // eslint-disable-next-line prefer-const
    let [, emoji, type, scope = "", description] =
      commitMessage.match(/^(.*?)\s*(\w+)(\([^()]+\))?:\s(.+)/) ?? [];

    if (!type || !description) throw new Error("Invalid commit message");

    let emojiObj = EMOJI_MAP[type + scope];
    if (!emojiObj) {
      for (const key in EMOJI_MAP) {
        const val = EMOJI_MAP[key];
        if (type.startsWith(key)) {
          emojiObj = val;
        }
      }
    }
    emoji = emojiObj ? `${emojiObj.emoji} ` : "";

    const finalCommitMessage = `${emoji}${type}${scope}: ${description}`;
    writeFileSync(commitMessageFilePath, finalCommitMessage, "utf8");
  })();
}
