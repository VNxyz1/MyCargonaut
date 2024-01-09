import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { PostTripRequestRequestDto } from './DTOs/PostTripRequestRequestDto';
import { extname, join } from 'path';
import { ISession } from '../../utils/ISession';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TripRequest } from '../../database/TripRequest';
import { PlzService } from '../plz.service/plz.service';
import { RequestService } from '../request.service/request.service';
import { User } from '../../database/User';
import { UserService } from '../user.service/user.service';
import { GetAllTripRequestResponseDto } from './DTOs/GetAllTripRequestResponseDto';
import { GetTripRequestResponseDto } from './DTOs/GetTripRequestResponseDto';
import { convertUserToOtherUser } from '../utils/convertToOfferDto';
import { UpdateTripRequestRequestDto } from './DTOs/UpdateTripRequestRequestDto';
import { existsSync, unlinkSync } from 'fs';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly plzService: PlzService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(fileInterceptor())
  @ApiOperation({ summary: 'Creates a new trip request' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async post(
    @Body() body: PostTripRequestRequestDto,
    @Session() session: ISession,
    @UploadedFile() cargoImg?: Express.Multer.File,
  ) {
    const user = await this.userService.getUserById(session.userData.id);
    const tR = await this.createTripRequest(body, user, cargoImg);

    await this.requestService.save(tR);

    return new OKResponseWithMessageDTO(true, 'Trip request created');
  }

  @Get('all')
  @ApiOperation({ summary: 'gets all trip request' })
  @ApiResponse({ type: GetAllTripRequestResponseDto })
  async getAll() {
    const dto = new GetAllTripRequestResponseDto();
    dto.tripRequests = await this.requestService.getAll();
    return dto;
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'gets trip request by id' })
  @ApiResponse({ type: GetTripRequestResponseDto })
  async getOne(@Param('id', ParseIntPipe) tripRequestId: number) {
    const tR = await this.requestService.getById(tripRequestId);
    const dto = new GetTripRequestResponseDto();
    dto.id = tR.id;
    dto.requester = convertUserToOtherUser(tR.requester);
    dto.startPlz = tR.startPlz;
    dto.endPlz = tR.endPlz;
    dto.createdAt = tR.createdAt;
    dto.description = tR.description;
    dto.cargoImg = tR.cargoImg;
    dto.startDate = tR.startDate;
    dto.seats = tR.seats;

    return dto;
  }

  @Delete(':id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary:
      'deletes the trip request by id. Only if the requester is the logged in user.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async delete(
    @Param('id', ParseIntPipe) tripRequestId: number,
    @Session() session: ISession,
  ) {
    const userId: number = session.userData.id;
    const tR = await this.requestService.getById(tripRequestId);

    this.loggedInUserIsRequester(userId, tR);

    await this.requestService.delete(tR);

    return new OKResponseWithMessageDTO(true, 'Transit request was deleted.');
  }

  @Put(':id')
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(fileInterceptor())
  @ApiOperation({
    description:
      'Updates the params of a transit request. Logged in user must be the requester.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async updateParams(
    @Param('id', ParseIntPipe) tripRequestId: number,
    @Session() session: ISession,
    @Body() body: UpdateTripRequestRequestDto,
    @UploadedFile() cargoImg?: Express.Multer.File,
  ) {
    const userId: number = session.userData.id;
    const tR = await this.requestService.getById(tripRequestId);

    this.loggedInUserIsRequester(userId, tR);

    if (cargoImg) {
      body.cargoImgString = cargoImg.filename;
      this.deletePicture(tR.cargoImg);
    }

    const updatedTripRequest = await this.updateTripRequest(tR, body);

    await this.requestService.save(updatedTripRequest);

    return new OKResponseWithMessageDTO(true, 'Update successful.');
  }

  loggedInUserIsRequester(userId: number, tripRequest: TripRequest) {
    if (userId !== tripRequest.requester.id) {
      throw new ForbiddenException(
        'You are not the requester of this trip request.',
      );
    }
  }

  async createTripRequest(
    dto: PostTripRequestRequestDto,
    user: User,
    cargoImg?: Express.Multer.File,
  ) {
    const tR = new TripRequest();

    if (cargoImg) {
      tR.cargoImg = cargoImg.filename;
    }

    tR.requester = user;

    tR.startPlz = await this.plzService.createPlz(
      dto.startPlz.plz,
      dto.startPlz.location,
    );
    tR.endPlz = await this.plzService.createPlz(
      dto.endPlz.plz,
      dto.endPlz.location,
    );

    tR.startDate = new Date(dto.startDate);

    tR.description = dto.description;
    tR.seats = dto.seats;

    return tR;
  }

  async updateTripRequest(
    tR: TripRequest,
    updateData: UpdateTripRequestRequestDto,
  ) {
    if (updateData.description) {
      tR.description = updateData.description;
    }

    if (updateData.startPlz) {
      tR.startPlz = await this.plzService.createPlz(
        updateData.startPlz.plz,
        updateData.startPlz.location,
      );
    }

    if (updateData.endPlz) {
      tR.endPlz = await this.plzService.createPlz(
        updateData.endPlz.plz,
        updateData.endPlz.location,
      );
    }

    if (updateData.cargoImgString) {
      tR.cargoImg = updateData.cargoImgString;
    }

    if (updateData.startDate) {
      tR.startDate = new Date(updateData.startDate);
    }

    return tR;
  }

  deletePicture(imageName: string) {
    const oldImagePath = join(
      process.cwd(),
      'uploads',
      'cargo-images',
      imageName,
    );
    if (!existsSync(oldImagePath)) {
      throw new NotFoundException('The picture to delete could not be found.');
    }

    unlinkSync(oldImagePath);
  }
}

const fileInterceptor = () => {
  return FileInterceptor('cargoImg', {
    storage: diskStorage({
      destination: './uploads/cargo-images',
      filename: (req: any, file, callback) => {
        const uniquSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const prefix = req.session.userData.id;
        const ext = extname(file.originalname);
        const filename = `ci-${prefix}-${uniquSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  });
};
