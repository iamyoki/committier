import type { ConfigType } from "../application/types/config.type.ts";

export function defineConfig<
  T extends {
    [K in keyof ConfigType]?: K extends "types"
      ? Partial<ConfigType[K]>
      : ConfigType[K];
  },
>(config: T): T {
  return config;
}
