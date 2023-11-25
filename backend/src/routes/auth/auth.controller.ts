import { Body, Controller, Post, Session } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service/auth.service';
import { ISession } from '../../utils/ISession';
import { LogInRequestDto } from './DTOs/LoginRequestDTO';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async login(@Session() session: ISession, @Body() body: LogInRequestDto) {
    const user = await this.authService.logIn(body);
    if (user) {
      session.userData = user;
      session.isLoggedIn = true;
      return new OKResponseWithMessageDTO(true, `Successfully logged in`);
    }
  }
}
