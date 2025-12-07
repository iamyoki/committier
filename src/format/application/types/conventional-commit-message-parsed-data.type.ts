export type ConventionalCommitMessageParsedDataType = {
  header: {
    emoji: string | undefined;
    type: string | undefined;
    scope: string[] | undefined;
    breakingChangeMark: string | undefined;
    description: string;
  };
  bodies: string[] | undefined;
  footers: string[] | undefined;
};
