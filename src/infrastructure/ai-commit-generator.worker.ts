import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from "node:worker_threads";
import { AiCommitMessage } from "../domain/ai-commit-message.ts";
import { AiCommitGenerator } from "./ai-commit-generator.ts";

if (!isMainThread) {
  const aiCommitGenerator = new AiCommitGenerator();
  const aiCommitMessage = await aiCommitGenerator.execute(workerData);
  parentPort?.postMessage(aiCommitMessage);
}

export class AiCommitGeneratorWorker extends AiCommitGenerator {
  constructor() {
    super();
  }

  async execute(params?: {
    userIntent?: string;
    _diff?: string;
  }): Promise<AiCommitMessage> {
    return new Promise((resolve, reject) => {
      const isTs = import.meta.filename.endsWith(".ts");
      const worker = isTs
        ? new Worker(
            `import('tsx/esm/api').then(({ register }) => { register(); import('${new URL(import.meta.url)}') })`,
            {
              eval: true,
              workerData: params,
            },
          )
        : new Worker(new URL(import.meta.url), { workerData: params });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(
            new Error(`AiCommitGeneratorWorker stopped with exit code ${code}`),
          );
      });
    });
  }
}
