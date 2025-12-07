import { ConventionalCommitMessageParser } from "../src/format/application/parsers/conventional-commit-message.parser.ts";

const parser = new ConventionalCommitMessageParser();

console.log(parser.parse("feat: add new feature"));
console.log(parser.parse("feat add new feature"));
console.log(parser.parse("feat(app1,app2): add new feature"));
console.log(parser.parse("feat(app1,  app2,app3)!: add new feature"));
console.log(parser.parse("feat(app1  app2 app3)!: add new feature"));
console.log(parser.parse("feat  :  add new feature"));
console.log(parser.parse("✨   feat app1,app2 ! :  add new feature"));
console.log(parser.parse("add new feature"));
console.log(parser.parse("!add new feature"));
console.log(parser.parse("app1,app2 add new feature"));
console.log(parser.parse("feat: committier edit"));
