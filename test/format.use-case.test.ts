import { ConfigService } from "../src/application/services/config.service.ts";
import { FormatUseCase } from "../src/application/use-cases/format.use-case.ts";
import { CosmiconfigConfigLoader } from "../src/infrastructure/cosmiconfig-config-loader.ts";

const configLoader = new CosmiconfigConfigLoader();
const configService = new ConfigService(configLoader);
const config = await configService.getConfig();

const format = new FormatUseCase(config);

console.log(format.execute({ rawMessage: "FEAT: add new feature" }));
console.log(format.execute({ rawMessage: "FEAT app1,app2!: add new feature" }));
console.log(format.execute({ rawMessage: "FEAT app1,app2 add new feature" }));
