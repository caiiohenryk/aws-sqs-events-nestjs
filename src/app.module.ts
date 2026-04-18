import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CallModule } from './modules/calls/call.module.js';
import { SqsModule } from '@ssut/nestjs-sqs';
import {
  CALL_QUEUE_URL,
  SQS_REGION,
  sqsClient,
} from './shared/sqs/sqs.config.js';

const prefix = 'api';

@Module({
  imports: [
    CallModule,
    RouterModule.register([{ path: `${prefix}/calls`, module: CallModule }]),
    SqsModule.register({
      consumers: [
        {
          name: 'CALL_QUEUE',
          queueUrl: CALL_QUEUE_URL,
          region: SQS_REGION,
          sqs: sqsClient,
        },
      ],
      producers: [
        {
          name: 'CALL_QUEUE',
          queueUrl: CALL_QUEUE_URL,
          region: SQS_REGION,
          sqs: sqsClient,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
