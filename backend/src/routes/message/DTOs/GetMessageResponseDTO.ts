import { IsInt, IsString, IsISO8601, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetMessageDto {
  @IsInt()
  @ApiProperty()
  senderId: number;

  @IsInt()
  @ApiProperty()
  conversationId: number;

  @IsString()
  @ApiProperty()
  message: string;

  @IsISO8601()
  @ApiProperty()
  timestamp: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  read: boolean;
}
