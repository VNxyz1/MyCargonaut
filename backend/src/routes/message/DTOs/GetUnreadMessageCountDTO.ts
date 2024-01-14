import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetUnreadMessageCountDto {
    @IsInt()
    @ApiProperty()
    conversationId: number;
    
    @IsInt()
    @ApiProperty()
    unreadMessages: number;
}
