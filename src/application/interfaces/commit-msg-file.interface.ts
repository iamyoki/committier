export interface CommitMsgFileInterface {
  read(filePath: string): Promise<string>;
  write(message: string): Promise<void>;
}
