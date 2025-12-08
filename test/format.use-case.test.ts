import { ConfigService } from "../src/format/application/services/config.service.ts";
import { FormatUseCase } from "../src/format/application/use-cases/format.use-case.ts";
import { CosmiconfigConfigLoader } from "../src/infrastructure/cosmiconfig-config-loader.ts";

const configLoader = new CosmiconfigConfigLoader();
const configService = new ConfigService(configLoader);
const config = await configService.getConfig();

const format = new FormatUseCase(config);

console.log(format.execute("FEAT: add new feature"));
console.log(format.execute("FEAT app1,app2!: add new feature"));
console.log(format.execute("FEAT app1,app2 add new feature"));
