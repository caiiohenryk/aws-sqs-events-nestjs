import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SQSClient } from '@aws-sdk/client-sqs';
import { CallModule } from './modules/calls/call.module.js';
import { SqsModule } from '@ssut/nestjs-sqs';

const prefix = 'api';
const localstackQueueUrl = 'http://localhost:4566/000000000000';
const sqsClient = new SQSClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

@Module({
  imports: [
    CallModule,
    RouterModule.register([{ path: `${prefix}/calls`, module: CallModule }]),
    SqsModule.register({
      consumers: [
        {
          name: 'CALL_QUEUE',
          queueUrl: `${localstackQueueUrl}/call_queue`,
          region: 'us-east-1',
          sqs: sqsClient,
        },
      ],
      producers: [
        {
          name: 'CALL_QUEUE',
          queueUrl: `${localstackQueueUrl}/call_queue`,
          region: 'us-east-1',
          sqs: sqsClient,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
