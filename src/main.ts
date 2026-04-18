import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { AppModule } from './app.module.js';
import {
  CALL_QUEUE_NAME,
  CALL_QUEUE_URL,
  SQS_ENDPOINT,
  sqsClient,
} from './shared/sqs/sqs.config.js';

type EnvMap = Record<string, string | undefined>;

const runtimeEnv: EnvMap =
  (globalThis as { Bun?: { env?: EnvMap } }).Bun?.env ??
  (globalThis as { process?: { env?: EnvMap } }).process?.env ??
  {};

const logger = new Logger('Bootstrap');

async function ensureCallQueueExists() {
  logger.log(
    `Ensuring queue exists | queue=${CALL_QUEUE_NAME} endpoint=${SQS_ENDPOINT}`,
  );

  try {
    await sqsClient.send(
      new CreateQueueCommand({
        QueueName: CALL_QUEUE_NAME,
      }),
    );
    logger.log(`Queue ready | queueUrl=${CALL_QUEUE_URL}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logger.error(
      `Failed to ensure queue | queue=${CALL_QUEUE_NAME} reason=${reason}`,
    );
    throw error;
  }
}

async function bootstrap() {
  if (runtimeEnv.SQS_AUTO_CREATE_QUEUE !== 'false') {
    await ensureCallQueueExists();
  } else {
    logger.warn(`Queue auto-create disabled | queue=${CALL_QUEUE_NAME}`);
  }

  const app = await NestFactory.create(AppModule);
  const port = runtimeEnv.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application started | port=${port}`);
}
await bootstrap();
