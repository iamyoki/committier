import { execSync } from "child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ConfigService } from "../application/services/config.service.ts";
import { FormatUseCase } from "../application/use-cases/format.use-case.ts";
import { CosmiconfigConfigLoader } from "./cosmiconfig-config-loader.ts";

export class FormatGitHook {
  async execute(commitMsgFilePath: string): Promise<string> {
    if (!existsSync(commitMsgFilePath)) {
      commitMsgFilePath = this.getDefaultCommitMsgFilePath();
    }
    const rawMessage = await readFile(commitMsgFilePath, "utf8");
    const configLoader = new CosmiconfigConfigLoader();
    const configService = new ConfigService(configLoader);
    const config = await configService.getConfig();
    const format = new FormatUseCase(config);
    const finalMessage = format.execute(rawMessage);
    await writeFile(commitMsgFilePath, finalMessage, "utf8");
    return finalMessage;
  }

  private getDefaultCommitMsgFilePath(): string {
    const rootDir = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    });
    return path.resolve(rootDir, ".git", "COMMIT_EDITMSG");
  }
}
