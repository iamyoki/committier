import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from "node:worker_threads";
import { AiCommitMessage } from "../domain/ai-commit-message.ts";
import { AiCommitGenerator } from "./ai-commit-generator.ts";

const Start = "start";
const Downloading = "Downloading";
const End = "end";

if (!isMainThread) {
  const aiCommitGenerator = new AiCommitGenerator();
  const aiCommitMessage = await aiCommitGenerator.execute({
    ...workerData,
    onModelDownloadStart() {
      parentPort?.postMessage({ symbol: Start });
    },
    onModelDownloading(info) {
      parentPort?.postMessage({ symbol: Downloading, info });
    },
    onModelDownloadEnd() {
      parentPort?.postMessage({ symbol: End });
    },
  });
  parentPort?.postMessage(aiCommitMessage);
}

export class AiCommitGeneratorWorker extends AiCommitGenerator {
  constructor() {
    super();
  }

  async execute(params?: {
    userIntent?: string;
    _diff?: string;
    onModelDownloadStart?: () => void;
    onModelDownloading?: (info: {
      file: string;
      MBSize: number;
      progress: number;
    }) => void;
    onModelDownloadEnd?: () => void;
    onTransformersInstall?: () => void;
  }): Promise<AiCommitMessage> {
    const { userIntent, _diff } = params ?? {};
    return new Promise((resolve, reject) => {
      const isTs = import.meta.filename.endsWith(".ts");
      const worker = isTs
        ? new Worker(
            `import('tsx/esm/api').then(({ register }) => { register(); import('${new URL(import.meta.url)}') })`,
            {
              eval: true,
              workerData: { userIntent, _diff },
            },
          )
        : new Worker(new URL(import.meta.url), {
            workerData: { userIntent, _diff },
          });
      worker.on("message", (message) => {
        switch (message.symbol) {
          case Start: {
            params?.onModelDownloadStart?.();
            break;
          }
          case Downloading: {
            params?.onModelDownloading?.(message.info);
            break;
          }
          case End: {
            params?.onModelDownloadEnd?.();
            break;
          }
          default: {
            resolve(message);
            break;
          }
        }
      });
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
