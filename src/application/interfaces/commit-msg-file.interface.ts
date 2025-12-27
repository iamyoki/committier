export interface CommitMsgFileInterface {
  read(filePath?: string): Promise<string>;
  write(message: string, filePath?: string): Promise<void>;
}
