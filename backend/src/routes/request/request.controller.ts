import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get, InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query, Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { PostTripRequestRequestDto } from './DTOs/PostTripRequestRequestDto';
import { join } from 'path';
import { ISession } from '../../utils/ISession';
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
import { fileInterceptor } from './requesterFileInterceptor';
import { GetFilteredTripRequestRequestDto } from './DTOs/GetFilteredTripRequestRequestDto';
import {Response} from "express";

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
    const tRArr = await this.requestService.getAll();
    const dto = new GetAllTripRequestResponseDto();
    dto.tripRequests = tRArr.map((tR) => {
      return this.convertToGetDto(tR);
    });
    return dto;
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'gets trip request by id' })
  @ApiResponse({ type: GetTripRequestResponseDto })
  async getOne(@Param('id', ParseIntPipe) tripRequestId: number) {
    const tR = await this.requestService.getById(tripRequestId);

    return this.convertToGetDto(tR);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Gets filtered trip requests based on various criteria',
  })
  @ApiResponse({
    type: GetAllTripRequestResponseDto,
    description: 'A DTO containing the filtered trip requests.',
  })
  async getFilter(@Query() query: GetFilteredTripRequestRequestDto) {
    let tRArr: TripRequest[];

    if (query.searchString) {
      tRArr = await this.requestService.getFilteredBySearchstring(
        query.searchString,
      );
    } else {
      tRArr = await this.requestService.getAll();
    }

    if (query.seats) {
      const seats = Number(query.seats);
      tRArr = this.filterRequestsBySeats(seats, tRArr);
    }

    if (query.date) {
      const date = new Date(query.date);
      tRArr = this.filterAndSortByDate(date, tRArr);
    }

    if (query.fromPLZ && !query.toPLZ) {
      tRArr = this.filterStartByPlz(query.fromPLZ, tRArr);
    }

    if (query.toPLZ && !query.fromPLZ) {
      tRArr = this.filterEndByPlz(query.toPLZ, tRArr);
    }

    if (query.fromPLZ && query.toPLZ) {
      tRArr = this.filterStartToEndPlz(query.fromPLZ, query.toPLZ, tRArr);
    }

    /* TODO: filterByRating */

    const dto = new GetAllTripRequestResponseDto();
    dto.tripRequests = tRArr.map((tR) => {
      return this.convertToGetDto(tR);
    });
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

  @Get('cargo-image/:imagename')
  @ApiOperation({ description: 'Get a cargo image' })
  @ApiResponse({
    description: 'The retrieved cargo image',
    type: 'image/png',
  })
  async findCargoImage(
      @Param('imagename') imagename: string,
      @Res() res: Response,
  ) {
    try {
      const imagePath = join(
          process.cwd(),
          'uploads',
          'cargo-images',
          imagename,
      );
      res.sendFile(imagePath);
    } catch (error) {
      return new InternalServerErrorException('Image not found');
    }
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

  convertToGetDto(tripRequest: TripRequest) {
    const dto = new GetTripRequestResponseDto();
    dto.id = tripRequest.id;
    dto.requester = convertUserToOtherUser(tripRequest.requester);
    dto.startPlz = tripRequest.startPlz;
    dto.endPlz = tripRequest.endPlz;
    dto.createdAt = new Date(tripRequest.createdAt);
    dto.description = tripRequest.description;
    dto.cargoImg = tripRequest.cargoImg;
    dto.startDate = tripRequest.startDate;
    dto.seats = tripRequest.seats;

    return dto;
  }

  filterRequestsBySeats(
    seats: number,
    tripRequests: TripRequest[],
  ): TripRequest[] {
    return tripRequests.filter((tR) => tR.seats === seats);
  }

  filterAndSortByDate(date: Date, tripRequests: TripRequest[]) {
    const filteredRequests = tripRequests.filter((tR) => {
      return tR.startDate >= date;
    });

    filteredRequests.sort((a, b) => {
      const aDateNumber = a.startDate.getTime();
      const bDateNumber = b.startDate.getTime();
      return aDateNumber - bDateNumber;
    });

    return filteredRequests;
  }

  filterStartByPlz(startPlz: string, tripRequests: TripRequest[]) {
    return tripRequests.filter((tR) => tR.startPlz.plz === startPlz);
  }

  filterEndByPlz(endPlz: string, tripRequests: TripRequest[]) {
    return tripRequests.filter((tR) => tR.endPlz.plz === endPlz);
  }

  filterStartToEndPlz(
    fromPlz: string,
    toPlz: string,
    tripRequests: TripRequest[],
  ): TripRequest[] {
    return tripRequests.filter((tR) => {
      return tR.endPlz.plz === toPlz && tR.startPlz.plz === fromPlz;
    });
  }
}
