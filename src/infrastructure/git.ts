import { simpleGit } from "simple-git";
import type { GitInterface } from "../application/interfaces/git.interface.ts";

export class Git implements GitInterface {
  private readonly git = simpleGit();

  async add(filePaths: string[]): Promise<void> {
    await this.git.add(filePaths);
  }

  async commit(message: string, filePaths?: string[]): Promise<void> {
    await this.git.commit(message, filePaths);
  }
}
