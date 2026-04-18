import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import type { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class CreateCallConsumer {
  private readonly logger = new Logger(CreateCallConsumer.name);

  @SqsMessageHandler('CALL_QUEUE', false)
  async handleMessage(message: Message) {
    const messageId = message.MessageId ?? 'unknown';

    if (!message.Body) {
      this.logger.warn(
        `Received SQS message without body | queue=CALL_QUEUE messageId=${messageId}`,
      );
      return;
    }

    this.logger.log(
      `Received SQS message | queue=CALL_QUEUE messageId=${messageId} bodySize=${message.Body.length}`,
    );

    try {
      const firstPass = JSON.parse(message.Body) as unknown;
      const data = (
        typeof firstPass === 'string' ? JSON.parse(firstPass) : firstPass
      ) as {
        id?: string;
        receivingNumber?: string;
        body?: {
          id?: string;
          receivingNumber?: string;
        };
      };

      const callId = data.id ?? data.body?.id ?? 'unknown';
      const receivingNumber =
        data.receivingNumber ?? data.body?.receivingNumber ?? 'unknown';

      this.logger.log(
        `Processed SQS message | queue=CALL_QUEUE messageId=${messageId} callId=${callId} receivingNumber=${receivingNumber}`,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to parse SQS message | queue=CALL_QUEUE messageId=${messageId} reason=${reason}`,
      );
      throw error;
    }
  }
}
