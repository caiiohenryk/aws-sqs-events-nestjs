import { Module } from '@nestjs/common';
import { CreateCallController } from './contexts/create/create-call.controller.js';
import { CreateCallConsumer } from '../../shared/consumers/create-call.consumer.js';

@Module({
  controllers: [CreateCallController],
  providers: [CreateCallConsumer],
})
export class CallModule {}
