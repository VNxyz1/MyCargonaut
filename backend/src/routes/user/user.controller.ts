import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service/user.service';
import { GetUserResponseDto } from './DTOs/GetUserResponseDTO';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ISession } from '../../utils/ISession';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Gets the Logged-In User' })
  @ApiResponse({ type: GetUserResponseDto })
  async getLoggedInUser(@Session() session: ISession) {
    const id = session.userData.id;
    const user = await this.userService.getUserById(id);
    const userDto = new GetUserResponseDto();

    userDto.id = user.id;
    userDto.username = user.username;
    userDto.eMail = user.eMail;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    userDto.profilePicture = user.profilePicture;

    return userDto;
  }
}
