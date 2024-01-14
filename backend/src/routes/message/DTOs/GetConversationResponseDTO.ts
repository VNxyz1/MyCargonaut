import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetMessageDto } from './GetMessageResponseDTO';
export class GetConversationDto {
    @IsInt()
    @ApiProperty()
    conversationPartnerId: number;

    @IsString()
    @ApiProperty()
    conversationPartnerName: string;

    @ApiProperty({ type: GetMessageDto })
    messages: GetMessageDto[];
}
