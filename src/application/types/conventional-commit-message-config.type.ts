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
  autoEmoji: boolean;
  autoScope: boolean | "replaceToPackageName" | "defaultToPackageName";
  defaultType: string;
  defaultDescription: boolean | "fileName" | "fileBasename" | "filePath";
  types: Record<TypeKey, Type>;
};
