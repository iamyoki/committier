import type { CommitMessageParserInterface } from "../../domain/interfaces/commit-message.parser.interface.ts";
import type { ConventionalCommitMessageParsedDataType } from "../types/conventional-commit-message-parsed-data.type.ts";

export class ConventionalCommitMessageParser
  implements
    CommitMessageParserInterface<ConventionalCommitMessageParsedDataType>
{
  parse(raw: string): ConventionalCommitMessageParsedDataType {
    let str = raw;
    const r = /^.*(?=\n?)/;
    const m = str.match(r);

    const headerSection = m?.[0];
    str = str.slice(headerSection?.length).trim();

    const restSections = str.length > 0 ? str.split("\n\n") : undefined;

    const bodiesSection =
      restSections &&
      (restSections.length > 1
        ? restSections.slice(0, -1)
        : restSections.slice(0));

    const footersSection =
      restSections &&
      (restSections.length > 1 ? restSections.slice(-1) : undefined);

    const data: ConventionalCommitMessageParsedDataType = Object.create(null);

    if (headerSection) {
      data.header = this.parseHeader(headerSection);
    } else {
      throw new Error("Missing header");
    }

    if (bodiesSection) {
      data.bodies = this.parseBodies(bodiesSection);
    }

    if (footersSection) {
      data.footers = this.parseFooters(footersSection);
    }
    return data;
  }

  parseHeader(
    headerSection: string,
  ): ConventionalCommitMessageParsedDataType["header"] {
    let str = headerSection.trim();
    let r: RegExp;
    let m: RegExpMatchArray | null;

    // emoji
    r = /\p{Emoji_Presentation}/u;
    m = str.match(r);
    const emoji = m?.[0];
    str = str.slice(emoji?.length).trimStart();

    // type
    r = /^(\w+)(?:[ (:]|$)/;
    m = str.match(r);
    const type = m?.[1];
    if (type) {
      str = str.slice(type.length).trimStart();
    }

    // scope
    // r = /^(([\w,]+)|(\(.+)\))[ :!]/;
    r = /^((\(.+\))|[^:!]+(?=[:!])|(\w+,(\w+,?)*))[ :!]/;
    m = str.match(r);
    const scopeStr = m?.[1];
    const scope = scopeStr
      ?.replace(/[()]/g, "")
      .split(/[, ]/)
      .filter((item) => !!item)
      .map((item) => item.trim());
    str = str.slice(scopeStr?.length).trimStart();

    // breaking change mark
    let breakingChangeMark: string | undefined;
    const markIndex = str.indexOf("!");
    if (markIndex !== -1) {
      breakingChangeMark = str[markIndex];
      str = str.slice(markIndex);
    }

    // description
    const descStartIndex = str.match(/\p{L}/u)?.index;
    const description =
      descStartIndex !== undefined ? str.slice(descStartIndex) : "";
    // if (!description) throw new Error("Missing header description");

    return {
      emoji,
      type,
      scope,
      breakingChangeMark,
      description,
    };
  }

  parseBodies(bodiesSection: string[]) {
    return bodiesSection;
  }

  parseFooters(footersSection: string[]) {
    return footersSection;
  }
}
