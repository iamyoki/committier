import path from "node:path";

export class CommitFile {
  public readonly filePath: string;
  public packageName: string | undefined;
  public commitable: boolean;
  public addable: boolean;

  private constructor(
    filePath: string,
    packageName: string | undefined,
    commitable: boolean,
    addable: boolean,
  ) {
    this.filePath = filePath;
    this.packageName = packageName;
    this.commitable = commitable;
    this.addable = addable;
  }

  static create(
    filePath: string,
    packageName: string | undefined,
    commitable: boolean,
    addable: boolean,
  ): CommitFile {
    return new CommitFile(filePath, packageName, commitable, addable);
  }

  get fileName(): string {
    return path.basename(this.filePath);
  }

  get packageNameWithoutScope(): string | undefined {
    return this.packageName?.replace(/^.+\//, "");
  }
}
