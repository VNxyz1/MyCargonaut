import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { compare } from '../utils/hash';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async login(@Session() session: ISession, @Body() body: LogInRequestDto) {
    const user = await this.authService.getUserByEMail(body.eMail);

    await this.checkUser(body.password, user.password);

    session.userData = user;
    session.isLoggedIn = true;
    return new OKResponseWithMessageDTO(true, `Successfully logged in`);
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

  private async checkUser(password: string, hash: string) {
    const match = await compare(password, hash);
    if (!match) {
      throw new NotFoundException(
        `There is no combination of this email and password.`,
      );
    }
    return match;
  }
}
