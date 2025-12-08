import type { ConfigType } from "../types/config.type.ts";

export interface ConfigLoaderInterface {
  load(): Promise<Partial<ConfigType> | undefined>;
}
