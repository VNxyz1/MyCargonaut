import { ApiProperty } from '@nestjs/swagger';
import { GetUnreadMessageCountDto } from './GetUnreadMessageCountDTO';
export class GetUnreadMessagesCountDto {
  @ApiProperty()
  totalUnreadMessages: number;

  @ApiProperty({ type: [GetUnreadMessageCountDto] })
  conversations: GetUnreadMessageCountDto[];
}
