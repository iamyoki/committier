export class CommitMessage {
  readonly header: string;
  readonly bodies: string[] | undefined;
  readonly footers: string[] | undefined;

  private constructor(header: string, bodies?: string[], footers?: string[]) {
    this.header = header;
    this.bodies = bodies;
    this.footers = footers;
  }

  static create(
    header: string,
    bodies?: string[],
    footers?: string[],
  ): CommitMessage {
    return new CommitMessage(header, bodies, footers);
  }

  static equals(other: CommitMessage): boolean {
    return this.toString() === other.toString();
  }

  toString(): string {
    let str = `${this.header}`;
    if (this.bodies && this.bodies.length > 0) {
      str += `\n\n${this.bodies.join("\n")}`;
    }
    if (this.footers && this.footers.length > 0) {
      str += `\n\n${this.footers.join("\n")}`;
    }
    return str;
  }
}
