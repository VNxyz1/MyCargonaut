import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {UserService} from '../user.service/user.service';
import {GetUserResponseDto} from './DTOs/GetUserResponseDTO';
import {IsLoggedInGuard} from '../../guards/auth/is-logged-in.guard';
import {ISession} from '../../utils/ISession';
import {OKResponseWithMessageDTO} from '../../generalDTOs/OKResponseWithMessageDTO';
import {CreateUserRequestDto} from './DTOs/CreateUserRequestDTO';
import {UpdateUserRequestDto} from './DTOs/UpdateUserRequestDTO';
import {Response} from 'express';
import {diskStorage} from 'multer';
import {extname, join} from 'path';
import {FileInterceptor} from '@nestjs/platform-express';

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
    userDto.eMail = user.eMail;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    userDto.birthday = user.birthday;
    userDto.coins = user.coins;
    userDto.entryDate = user.entryDate;
    userDto.description = user.description;

    userDto.profilePicture = user.profilePicture;
    userDto.phoneNumber = user.phoneNumber;

    return userDto;
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new User' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async postUser(@Body() body: CreateUserRequestDto) {
    try {
      await this.userService.postUser(body);
      return new OKResponseWithMessageDTO(true, 'User Created');
    } catch (e: any) {
      if (e.errno == 19) {
        return new InternalServerErrorException('E-Mail bereits vergeben');
      }
    }
  }

  @Put()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Updates the Logged-In User' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async updateUser(
    @Session() session: ISession,
    @Body() body: UpdateUserRequestDto,
  ) {
    const id = session.userData.id;
    await this.userService.updateLoggedInUser(id, body);
    return new OKResponseWithMessageDTO(true, 'User Updated');
  }

  @Delete()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Deletes the Logged-In User' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async deleteUser(@Session() session: ISession) {
    const id = session.userData.id;
    session.userData = undefined;
    session.isLoggedIn = undefined;
    await this.userService.deleteLoggedInUser(id);
    return new OKResponseWithMessageDTO(true, 'User deleted.');
  }

  @Get('all')
  @ApiOperation({ summary: 'Gets all Users' })
  @ApiResponse({ type: GetUserResponseDto, isArray: true })
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    return users.map((user) => {
      const userDto = new GetUserResponseDto();
      userDto.id = user.id;
      userDto.eMail = user.eMail;
      userDto.firstName = user.firstName;
      userDto.lastName = user.lastName;
      userDto.birthday = user.birthday;
      userDto.coins = user.coins;
      userDto.profilePicture = user.profilePicture;
      userDto.phoneNumber = user.phoneNumber;
      userDto.description = user.description;
      userDto.entryDate = user.entryDate;
      return userDto;
    });
  }

  /* Profile picture upload */
  @Put('upload')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Upload/Replace profile picture and update path in user',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniquSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = req.session.userData.id;
          const ext = extname(file.originalname);
          const filename = `pp-${prefix}-${uniquSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @Session() session: ISession,
    @UploadedFile() file: any,
  ) {
    try {
      this.userService.removeOldImage(session.userData.id);
      this.userService.saveProfileImagePath(session.userData.id, file.filename);
      return new OKResponseWithMessageDTO(
        true,
        'Successfully updated profile image',
      );
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new InternalServerErrorException('Error uploading profile image');
    }
  }

  @Get('profile-image/:imagename')
  @ApiOperation({ summary: 'Get a profile picture' })
  @ApiResponse({
    description: 'Profile picture retrieved successfully',
    type: 'image/png',
  })
  async findProfileImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ) {
    try {
      const imagePath = join(
        process.cwd(),
        'uploads',
        'profile-images',
        imagename,
      );
      res.sendFile(imagePath);
    } catch (error) {
      return new InternalServerErrorException('Image not found');
    }
  }

  @Delete('remove-profile-image')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Remove profile picture' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async removeProfileImage(@Session() session: ISession) {
    try {
      this.userService.removeOldImage(session.userData.id);
      this.userService.saveProfileImagePath(session.userData.id, '');
      return new OKResponseWithMessageDTO(
        true,
        'Successfully removed profile image',
      );
    } catch (error) {
      console.error('Error removing profile image:', error);
      throw new InternalServerErrorException('Error removing profile image');
    }
  }
}
