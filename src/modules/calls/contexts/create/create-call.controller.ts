import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { CallQueueRequestDto } from './dto/create-call.input.dto.js';
import { SqsService } from '@ssut/nestjs-sqs';

@Controller({ version: '1' })
export class CreateCallController {
  private readonly logger = new Logger(CreateCallController.name);

  constructor(private readonly sqsService: SqsService) {}

  @Post('create')
  async execute(@Body() payload: CallQueueRequestDto) {
    const callId = payload.id;

    this.logger.log(
      `Queueing call request | queue=CALL_QUEUE callId=${callId}`,
    );

    try {
      await this.sqsService.send('CALL_QUEUE', {
        ...payload,
        id: callId,
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to queue call request | queue=CALL_QUEUE callId=${callId} reason=${reason}`,
      );
      throw new InternalServerErrorException('Could not enqueue call request');
    }

    this.logger.log(
      `Call request queued successfully | queue=CALL_QUEUE callId=${callId}`,
    );

    return {
      message: 'Call requested with success',
      callId,
    };
  }
}
