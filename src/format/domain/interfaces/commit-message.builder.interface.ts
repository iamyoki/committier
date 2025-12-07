import type { CommitMessage } from "../commit-message.ts";
import type { FormatRuleInterface } from "./format-rule.interface.ts";

export interface CommitMessageBuilderInterface<T> {
  data: T;

  applyRules(formatRules: FormatRuleInterface<T>[]): void;

  build(): CommitMessage;
}
