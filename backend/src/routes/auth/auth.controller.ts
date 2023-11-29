import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service/auth.service';
import { ISession } from '../../utils/ISession';
import { LogInRequestDto } from './DTOs/LoginRequestDTO';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { GetLogInResponseDto } from './DTOs/GetLoginResponseDto';

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

  @Post('logout')
  @UseGuards(IsLoggedInGuard)
  @ApiResponse({
    type: OKResponseWithMessageDTO,
    description: `Successfully logged out`,
  })
  async logout(@Session() session: ISession) {
    session.userData = undefined;
    session.isLoggedIn = undefined;
    return new OKResponseWithMessageDTO(true, 'Successfully logged out');
  }

  @Get('login')
  @ApiResponse({
    type: GetLogInResponseDto,
    description: `Checks of there is an existing session`,
  })
  async getLogin(@Session() session: ISession) {
    if (session.isLoggedIn) {
      return new GetLogInResponseDto(true);
    } else {
      return new GetLogInResponseDto(false);
    }
  }
}
