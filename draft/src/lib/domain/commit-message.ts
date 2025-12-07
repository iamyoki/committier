export class CommitMessage {
  constructor(
    public readonly emoji: string | undefined,
    public readonly type: string, // "feat"
    public readonly scope: string | undefined, // "app1,app2"
    public readonly hasBreakingChangeMark: boolean, // "feat!"
    public readonly description: string,
    public readonly bodyAndFooter: string | undefined,
  ) {
    this.scope = scope?.replaceAll(" ", "");
  }

  // e.g. "feat: a new feature", "feat(app1)!: a breaking change feature"
  static fromCommitMessageStr(str: string): CommitMessage {
    const groups =
      str.match(/^(?:(\S+?) )?(\w+)(\(.+\))?(!?): (.+)((.|\n)*)$/) ?? [];
    const [
      __all,
      emoji,
      type,
      scope,
      breakingChangeMark,
      description,
      bodyAndFooter,
    ] = groups;

    if (!type || !description) throw new Error("Invalid commit message format");

    return new CommitMessage(
      emoji,
      type,
      scope,
      breakingChangeMark === "!",
      description,
      bodyAndFooter,
    );
  }

  toCommitMessageStr(): string {
    const emojiPart = this.emoji ? this.emoji + " " : "";
    const typePart = this.type;
    const scopePart = this.scope ? `(${this.scope})` : "";
    const breakingChangeMarkPart = this.hasBreakingChangeMark ? "!" : "";
    const descriptionPart = this.description;
    const bodyAndFooterPart = this.bodyAndFooter ?? "";
    return `${emojiPart}${typePart}${scopePart}${breakingChangeMarkPart}: ${descriptionPart}${bodyAndFooterPart}`;
  }

  toString(): string {
    return this.toCommitMessageStr();
  }

  setEmoji(emoji: string): CommitMessage {
    return new CommitMessage(
      emoji,
      this.type,
      this.scope,
      this.hasBreakingChangeMark,
      this.description,
      this.bodyAndFooter,
    );
  }

  setPackageNamesAsScope(packageNames: string[]): CommitMessage {
    const dedup = Array.from(new Set(packageNames));
    const scope = dedup.length
      ? dedup.map((name) => name.replace(/^@.+\//, "")).join(",")
      : undefined;

    return new CommitMessage(
      this.emoji,
      this.type,
      scope,
      this.hasBreakingChangeMark,
      this.description,
      this.bodyAndFooter,
    );
  }

  setScope(scope: string): CommitMessage {
    scope = scope.replaceAll(" ", "");
    return new CommitMessage(
      this.emoji,
      this.type,
      scope,
      this.hasBreakingChangeMark,
      this.description,
      this.bodyAndFooter,
    );
  }

  appendScopeNames(...scopeNames: string[]): CommitMessage {
    if (!scopeNames.length)
      throw new Error("Should provide at least one scope name");

    return new CommitMessage(
      this.emoji,
      this.type,
      `(${this.getScopeList()},${scopeNames.join(",")})`,
      this.hasBreakingChangeMark,
      this.description,
      this.bodyAndFooter,
    );
  }

  getScopeList(): string[] | undefined {
    if (this.scope) {
      return this.scope.split(",");
    }
  }
}
