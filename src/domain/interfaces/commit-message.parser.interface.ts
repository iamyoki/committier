export interface CommitMessageParserInterface<T> {
  parse(raw: string): T;
}
