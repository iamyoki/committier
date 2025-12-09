import assert from "node:assert";
import { describe, it } from "node:test";
import type { ConfigLoaderInterface } from "../../../src/application/interfaces/config-loader.interface.ts";
import { ConfigService } from "../../../src/application/services/config.service.ts";
import { type ConfigType } from "../../../src/index.ts";

class MockConfigLoader implements ConfigLoaderInterface {
  async load(): Promise<Partial<ConfigType> | undefined> {
    return {
      autoScope: "defaultToPackageName",
      types: {
        chore: {
          emoji: "😀",
        },
      },
    } as ConfigType;
  }
}

describe("config service", () => {
  it("should partially merge user config with default config", async () => {
    const configLoader = new MockConfigLoader();
    const configService = new ConfigService(configLoader);
    const config = await configService.getConfig();
    assert.partialDeepStrictEqual(config, {
      autoEmoji: true,
      autoScope: "defaultToPackageName",
      types: {
        feat: { emoji: "✨" },
        chore: {
          emoji: "😀",
          title: "Chores",
        },
      },
    });
  });
});
