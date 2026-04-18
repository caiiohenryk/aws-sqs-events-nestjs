import { NestFactory } from '@nestjs/core';
import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { AppModule } from './app.module.js';
import { CALL_QUEUE_NAME, sqsClient } from './shared/sqs/sqs.config.js';

type EnvMap = Record<string, string | undefined>;

const runtimeEnv: EnvMap =
  (globalThis as { Bun?: { env?: EnvMap } }).Bun?.env ??
  (globalThis as { process?: { env?: EnvMap } }).process?.env ??
  {};

async function ensureCallQueueExists() {
  await sqsClient.send(
    new CreateQueueCommand({
      QueueName: CALL_QUEUE_NAME,
    }),
  );
}

async function bootstrap() {
  if (runtimeEnv.SQS_AUTO_CREATE_QUEUE !== 'false') {
    await ensureCallQueueExists();
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(runtimeEnv.PORT ?? 3000);
}
await bootstrap();
