import { DefaultConfig as defaultConfig } from "../constants/default-config.constant.ts";
import type { ConfigLoaderInterface } from "../interfaces/config-loader.interface.ts";
import type { ConfigType } from "../types/config.type.ts";

export class ConfigService {
  constructor(private readonly configLoader: ConfigLoaderInterface) {}

  async getConfig(): Promise<ConfigType> {
    const userConfig = await this.configLoader.load();
    const config: ConfigType = { ...defaultConfig, ...userConfig };

    if (userConfig?.types) {
      config.types = {
        ...defaultConfig.types,
        ...userConfig.types,
      };
    }
    return config;
  }
}
