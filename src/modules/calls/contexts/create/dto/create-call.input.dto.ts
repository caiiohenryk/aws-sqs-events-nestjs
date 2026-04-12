class CreateCallRequestDto {
  outcomingNumber: string;
  receivingNumber: string;

  constructor(body: CreateCallRequestDto) {
    this.outcomingNumber = body.outcomingNumber;
    this.receivingNumber = body.receivingNumber;
  }
}

export class CallQueueRequestDto {
  id: string;
  body: CreateCallRequestDto;

  constructor(payload: CallQueueRequestDto) {
    this.id = payload.id;
    this.body = payload.body;
  }
}
