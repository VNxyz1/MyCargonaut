import { ApiProperty } from '@nestjs/swagger';

export class OKResponseWithMessageDTO {
  @ApiProperty()
  ok: boolean;

  @ApiProperty()
  message: string;

  constructor(ok: boolean, message: string) {
    this.ok = ok;
    this.message = message;
  }
}
