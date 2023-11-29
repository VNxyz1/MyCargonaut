import { ApiProperty } from '@nestjs/swagger';

export class GetLogInResponseDto {
  @ApiProperty()
  isLoggedIn: boolean;

  constructor(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }
}
