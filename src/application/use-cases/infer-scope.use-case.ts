import type { GetCommitFilesUseCase } from "./get-commit-files.use-case.ts";

export class InferScopeUseCase {
  constructor(private readonly getCommitFilesUseCase: GetCommitFilesUseCase) {}

  async execute(filePaths: string[]): Promise<string[]> {
    const allFiles = await this.getCommitFilesUseCase.execute();
    const packageNames = allFiles
      .filter(
        (f) => filePaths.includes(f.filePath) && f.packageNameWithoutScope,
      )
      .map((f) => f.packageNameWithoutScope) as string[];
    const dedup = Array.from(new Set(packageNames));
    return dedup;
  }
}
