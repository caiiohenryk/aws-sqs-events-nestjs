import { SQSClient } from '@aws-sdk/client-sqs';

const defaultEndpoint = 'http://localhost:9324';
const defaultRegion = 'us-east-1';
const defaultAccountId = '000000000000';
const defaultQueueName = 'call_queue';

type EnvMap = Record<string, string | undefined>;

const bunEnv = (globalThis as { Bun?: { env?: EnvMap } }).Bun?.env;
const nodeEnv = (globalThis as { process?: { env?: EnvMap } }).process?.env;

export const runtimeEnv: EnvMap = bunEnv ?? nodeEnv ?? {};

export const SQS_ENDPOINT =
  runtimeEnv.SQS_ENDPOINT?.replace(/\/$/, '') ?? defaultEndpoint;
export const SQS_REGION = runtimeEnv.SQS_REGION ?? defaultRegion;
export const SQS_ACCOUNT_ID = runtimeEnv.SQS_ACCOUNT_ID ?? defaultAccountId;
export const CALL_QUEUE_NAME = runtimeEnv.CALL_QUEUE_NAME ?? defaultQueueName;
const defaultQueueUrl = `${SQS_ENDPOINT}/${SQS_ACCOUNT_ID}/${CALL_QUEUE_NAME}`;
export const CALL_QUEUE_URL = runtimeEnv.SQS_QUEUE_URL ?? defaultQueueUrl;

export const sqsClient = new SQSClient({
  region: SQS_REGION,
  endpoint: SQS_ENDPOINT,
  credentials: {
    accessKeyId: runtimeEnv.AWS_ACCESS_KEY_ID ?? 'test',
    secretAccessKey: runtimeEnv.AWS_SECRET_ACCESS_KEY ?? 'test',
  },
});
