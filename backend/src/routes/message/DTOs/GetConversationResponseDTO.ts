import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetMessageDto } from './GetMessageResponseDTO';
export class GetConversationDto {
    @IsInt()
    @ApiProperty()
    conversationId: number;
    
    @IsInt()
    @ApiProperty()
    conversationPartnerId: number;

    @IsString()
    @ApiProperty()
    conversationPartnerName: string;

    @ApiProperty({ type: GetMessageDto })
    messages: GetMessageDto[];
}
