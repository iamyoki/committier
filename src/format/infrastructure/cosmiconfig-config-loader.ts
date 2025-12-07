import { cosmiconfig } from "cosmiconfig";
import type { ConfigLoaderInterface } from "../application/interfaces/config-loader.interface.ts";
import type { ConfigType } from "../application/types/config.type.ts";

export class CosmiconfigConfigLoader implements ConfigLoaderInterface {
  private readonly explorer = cosmiconfig("committier");

  async load(): Promise<ConfigType | undefined> {
    const result = await this.explorer.search();
    return result?.config;
  }
}
