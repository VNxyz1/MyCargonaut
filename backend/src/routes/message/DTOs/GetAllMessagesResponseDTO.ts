import { ApiProperty } from '@nestjs/swagger';
import { GetConversationDto } from './GetConversationResponseDTO';
export class GetAllMessagesDto {
    @ApiProperty({ type: GetConversationDto })
    conversations: GetConversationDto[];
}
