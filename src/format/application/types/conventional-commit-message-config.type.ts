type TypeKey =
  | "feat"
  | "fix"
  | "refactor"
  | "perf"
  | "chore"
  | "test"
  | "style"
  | "docs"
  | "revert"
  | "build"
  | "ci"
  | "breakingChange";

type Type = {
  emoji?: string;
  title: string;
  description: string;
  scopes?: {
    match: string | RegExp;
    emoji: string;
    title: string;
    description?: string;
  }[];
};

export type ConventionalCommitMessageConfigType = {
  autoEmoji: boolean | "replace" | "default";
  autoScope: boolean | "replaceToPackageName" | "defaultToPackageName";
  types: Record<TypeKey, Type>;
};
