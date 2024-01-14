import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
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
import { Response } from 'express';
import { PostTripRequestOffering } from './DTOs/PostTripRequestOffering';
import { userIsValidToBeProvider } from '../utils/userIsValidToBeProvider';
import { TripRequestOffering } from '../../database/TripRequestOffering';
import { RequestOfferingService } from '../request-offering.service/request-offering.service';
import { GetOfferingDto } from './DTOs/GetOfferingDto';
import { Offer } from '../../database/Offer';
import { PostTransformToOfferDto } from './DTOs/PostTransformToOfferDto';
import { TripState } from '../../database/TripState';
import { createRoutePart } from '../utils/createRoutePart';
import { OfferService } from '../offer.service/offer.service';
import { VehicleController } from '../vehicle/vehicle.controller';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { Vehicle } from 'src/database/Vehicle';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly plzService: PlzService,
    private readonly userService: UserService,
    private readonly offeringService: RequestOfferingService,
    private readonly offerService: OfferService,
    private readonly vehicleService: VehicleService
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

  @Post('offering/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description:
      'Send an offer to the requester of the request with the given ID.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async offerTransit(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) requestId: number,
    @Body() body: PostTripRequestOffering,
  ) {
    const offeringUserId = session.userData.id;
    const offeringUser = await this.userService.getUserById(offeringUserId);
    userIsValidToBeProvider(offeringUser);

    const tR = await this.requestService.getById(requestId);

    if (tR.requester.id === offeringUserId) {
      throw new ForbiddenException(
        'You are not allowed to make a offering to your own trip request!',
      );
    }

    const check =
      await this.requestService.userAlreadyPostedAOfferingToThisTripRequest(
        offeringUserId,
        requestId,
      );
    if (check) {
      throw new ForbiddenException(
        'You already sent a offering to this trip request!',
      );
    }

    const offering = new TripRequestOffering();
    offering.offeringUser = offeringUser;
    offering.tripRequest = tR;
    offering.text = body.text;
    offering.requestedCoins = body.requestedCoins;

    await this.offeringService.save(offering);

    return new OKResponseWithMessageDTO(true, 'Offer was send.');
  }

  @Get('offerings/offering-user')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Gets all pending Offerings that you offered.',
  })
  @ApiResponse({ type: [GetOfferingDto] })
  async getOfferingsAsOfferingUser(@Session() session: ISession) {
    const userId: number = session.userData.id;
    const offerings =
      await this.offeringService.getAllPendingOfOfferingUser(userId);

    return this.convertToGetOfferingDtoArr(offerings);
  }

  @Get('offerings/requesting-user')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description:
      'Gets all pending Offerings for which trip request you are the requester',
  })
  @ApiResponse({ type: [GetOfferingDto] })
  async getOfferingsAsRequestingUser(@Session() session: ISession) {
    const userId: number = session.userData.id;
    const offerings =
      await this.offeringService.getAllPendingOfRequestingUser(userId);

    return this.convertToGetOfferingDtoArr(offerings);
  }

  @Post('offering/accept/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description:
      'Accepts a offering with the given id. And executes the payment action if the user has enough coins.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async acceptOffering(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) offeringId: number,
  ) {
    const userId: number = session.userData.id;
    const offering = await this.offeringService.getById(offeringId);
    if (offering.tripRequest.requester.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to accept this offering!',
      );
    }

    const coinbalanceOfRequester =
      await this.userService.getCoinBalanceOfUser(userId);
    if (coinbalanceOfRequester < offering.requestedCoins) {
      throw new ForbiddenException(
        'The coin balance of the requesting user is not valid.',
      );
    }

    offering.accepted = true;
    await this.offeringService.save(offering);

    await this.userService.decreaseCoinBalanceOfUser(
      userId,
      offering.requestedCoins,
    );
    await this.userService.increaseCoinBalanceOfUser(
      offering.offeringUser.id,
      offering.requestedCoins,
    );

    return new OKResponseWithMessageDTO(true, 'Offering was accepted.');
  }

  @Post('transform-to-offer/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description:
      'Transforms a TripRequest, with an accepted Offering to an Offer.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async transformToOffer(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) requestId: number,
    @Body() body: PostTransformToOfferDto,
  ) {
    const userId: number = session.userData.id;

    const tR = await this.requestService.getWhereOfferingFromUserIsAccepted(
      userId,
      requestId,
    );

    const provider = await this.userService.getUserById(userId);
    const client = await this.userService.getUserById(tR.requester.id);

    await this.convertToOffer(tR, provider, client, body);

    await this.requestService.delete(tR);

    return new OKResponseWithMessageDTO(true, 'Offering was converted.');
  }

  @Post('not-transform/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Does not transform this TripRequest to an offer. Deletes it.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async notTransform(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) requestId: number
  ) {
    const userId: number = session.userData.id;

    const tR = await this.requestService.getWhereOfferingFromUserIsAccepted(
      userId,
      requestId,
    );

    await this.requestService.delete(tR);

    return new OKResponseWithMessageDTO(true, 'Offering was deleted.');
  }

  async convertToOffer(
    tripRequest: TripRequest,
    provider: User,
    client: User,
    data: PostTransformToOfferDto,
  ) {
    const offer = new Offer();
    offer.clients = [];
    offer.clients.push(client);
    offer.provider = provider;

    offer.state = TripState.offer;

    offer.bookedSeats = tripRequest.seats + data.additionalSeats;
    offer.vehicle = await this.vehicleService.getVehicle(data.vehicleId,provider.id);
    offer.startDate = new Date(data.startDate);
    offer.description = data.description;

    const offerDb = await this.offerService.saveOffer(offer);

    if (data.route) {
      data.route.map(async (routePartDto) => {
        const plz = await this.plzService.createPlz(
          routePartDto.plz,
          routePartDto.location,
        );
        const routePart = await createRoutePart(
          offerDb,
          plz,
          routePartDto.position,
        );
        await this.offerService.saveRoutePart(routePart);
      });
    }

    if (!data.route) {
      const plz1 = await this.plzService.createPlz(
        tripRequest.startPlz.plz,
        tripRequest.startPlz.location,
      );
      const plz2 = await this.plzService.createPlz(
        tripRequest.endPlz.plz,
        tripRequest.endPlz.location,
      );
      const routePart1 = await createRoutePart(offerDb, plz1, 1);
      const routePart2 = await createRoutePart(offerDb, plz2, 2);
      await this.offerService.saveRoutePart(routePart1);
      await this.offerService.saveRoutePart(routePart2);
    }
  }

  convertToGetOfferingDtoArr(
    offerings: TripRequestOffering[],
  ): GetOfferingDto[] {
    return offerings.map((o) => {
      return this.convertToGetOfferingDto(o);
    });
  }

  convertToGetOfferingDto(offering: TripRequestOffering): GetOfferingDto {
    const dto = new GetOfferingDto();
    dto.id = offering.id;
    dto.offeringUser = convertUserToOtherUser(offering.offeringUser);
    dto.tripRequest = this.convertToGetDto(offering.tripRequest);
    dto.text = offering.text;
    dto.requestedCoins = offering.requestedCoins;
    dto.accepted = offering.accepted;
    return dto;
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
