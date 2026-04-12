import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import type { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class CreateCallConsumer {
  @SqsMessageHandler('CALL_QUEUE', false)
  async handleMessage(message: Message) {
    if (!message.Body) {
      console.log('Message received without body');
      return;
    }

    const data = JSON.parse(message.Body);
    console.log(`Message received: ${JSON.stringify(data)}`);
  }
}
