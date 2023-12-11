import {
  Body,
  Controller,
  Delete,
  Get, InternalServerErrorException,
  Post,
  Put,
  Session,
  UseGuards,

  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service/user.service';
import { GetUserResponseDto } from './DTOs/GetUserResponseDTO';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ISession } from '../../utils/ISession';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateUserRequestDto } from './DTOs/CreateUserRequestDTO';
import { UpdateUserRequestDto } from './DTOs/UpdateUserRequestDTO';


import { Multer, MulterFile } from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';




const storage = diskStorage({
  destination: './uploads/profile-images',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const multerConfig = {
  storage: storage,
};


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
    } catch (e) {
      if (e.errno == 19) {
        return new InternalServerErrorException("E-Mail bereits vergeben");
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

    const usersDto: GetUserResponseDto[] = users.map(user => {
      const userDto = new GetUserResponseDto();
      userDto.id = user.id;
      userDto.eMail = user.eMail;
      userDto.firstName = user.firstName;
      userDto.lastName = user.lastName;
      userDto.birthday = user.birthday;
      userDto.coins = user.coins;
      userDto.profilePicture = user.profilePicture;
      userDto.phoneNumber = user.phoneNumber;
      return userDto;
    });

    return usersDto;
  }






  @Post('upload-profile-image')
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
      @Session() session: ISession,
      @UploadedFile() file,
  ): Promise<{ url: string }> {
    try {
      console.log(file);
      const imagePath = `./uploads/profile-images/${file.originalname}`;
      fs.writeFileSync(imagePath, file.buffer);
      await this.userService.saveProfileImagePath(session.userData.id, imagePath);

      return { url: imagePath };
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new InternalServerErrorException("Fehler beim Hochladen des Profilbilds");
    }
  }




}
