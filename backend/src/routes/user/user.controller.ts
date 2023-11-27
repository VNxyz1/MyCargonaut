import {Body, Controller, Delete, Get, Post, Put, Session, UseGuards} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service/user.service';
import { GetUserResponseDto } from './DTOs/GetUserResponseDTO';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ISession } from '../../utils/ISession';
import {OKResponseWithMessageDTO} from "../../generalDTOs/OKResponseWithMessageDTO";
import {CreateUserRequestDto} from "./DTOs/CreateUserRequestDTO";
import {UpdateUserRequestDto} from "./DTOs/UpdateUserRequestDTO";

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

  @Post()
  @ApiOperation({summary: 'Creates a new User'})
  @ApiResponse({type: OKResponseWithMessageDTO})
  async postUser(@Body() body: CreateUserRequestDto) {
    await this.userService.postUser(body);
    return new OKResponseWithMessageDTO(true, "User Created");
  }

  @Put()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({summary: 'Updates the Logged-In User'})
  @ApiResponse({type: OKResponseWithMessageDTO})
  async updateUser(
      @Session() session: ISession,
      @Body() body: UpdateUserRequestDto
  ) {
    const id = session.userData.id;
    await this.userService.updateLoggedInUser(id, body);
    return new OKResponseWithMessageDTO(true, "User Updated");

  }

  @Delete()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({summary: 'Deletes the Logged-In User'})
  @ApiResponse({type: OKResponseWithMessageDTO})
  async deleteUser(
      @Session() session: ISession
  ) {
    const id = session.userData.id;
    session.userData = undefined;
    session.isLoggedIn = undefined;
    await this.userService.deleteLoggedInUser(id);
    return new OKResponseWithMessageDTO(true, "User deleted.")

  }

}
