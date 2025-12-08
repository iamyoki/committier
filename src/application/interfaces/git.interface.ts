export interface GitInterface {
  add(filePaths: string[]): Promise<void>;
  commit(message: string, filePaths?: string[]): Promise<void>;
}
