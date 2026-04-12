import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CallQueueRequestDto } from './dto/create-call.input.dto.js';
import { SqsService } from '@ssut/nestjs-sqs';

@Controller({ version: '1' })
export class CreateCallController {
  constructor(private readonly sqsService: SqsService) {}

  @Post('create')
  async execute(@Body() payload: CallQueueRequestDto) {
    if (!payload.body.outcomingNumber || !payload.body.receivingNumber) {
      throw new BadRequestException('Wrong phone call format');
    }
    if (payload.id === undefined || payload.id === null) {
      throw new BadRequestException('Message id is required');
    }
    console.log(
      `Starting processing of ${payload.body.receivingNumber} phone call`,
    );
    await this.sqsService.send('CALL_QUEUE', {
      ...payload,
      id: String(payload.id),
    });
    return {
      message: 'Call requested with success',
      callId: `${payload.id}`,
    };
  }
}
