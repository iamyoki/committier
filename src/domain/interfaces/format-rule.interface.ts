export interface FormatRuleInterface<T> {
  ruleName: string;

  apply(parsedData: T): void;
}
