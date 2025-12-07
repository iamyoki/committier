export class CommitFile {
  constructor(
    public readonly filePath: string,
    public readonly fileName: string,
    public packageName: string | undefined,
    public commitable: boolean,
    public addable: boolean,
  ) {}

  static create(
    filePath: string,
    fileName: string,
    packageName: string | undefined,
    commitable: boolean,
    addable: boolean,
  ): CommitFile {
    return new CommitFile(filePath, fileName, packageName, commitable, addable);
  }

  setPackageName(string: string) {
    this.packageName = string;
  }

  commit() {
    if (!this.commitable) throw new Error("Not a commitable file");
    this.commitable = false;
    this.addable = false;
  }

  add() {
    if (!this.addable) throw new Error("Not an addable file");
    this.commitable = true;
    this.addable = false;
  }
}
