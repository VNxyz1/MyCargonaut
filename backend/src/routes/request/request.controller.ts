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
import { convertTripRequestToGetDto, convertUserToOtherUser } from '../utils/convertToOfferDto';
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
import { VehicleService } from '../vehicle.service/vehicle.service';
import { RatingService } from '../rating.service/rating.service';
import { MessageService } from '../message.service/message.service';
import { Message } from '../../database/Message';
import { MessageGatewayService } from '../../socket/message.gateway.service';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly plzService: PlzService,
    private readonly userService: UserService,
    private readonly offeringService: RequestOfferingService,
    private readonly offerService: OfferService,
    private readonly vehicleService: VehicleService,
    private readonly ratingService: RatingService,
    private readonly messageService: MessageService,
    private readonly messageGatewayService: MessageGatewayService,
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
      return convertTripRequestToGetDto(tR);
    });
    return dto;
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'gets trip request by id' })
  @ApiResponse({ type: GetTripRequestResponseDto })
  async getOne(@Param('id', ParseIntPipe) tripRequestId: number) {
    const tR = await this.requestService.getById(tripRequestId);

    return convertTripRequestToGetDto(tR);
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
      tRArr = await this.requestService.getFilteredBySearchstring(query.searchString);
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

    if (query.rating) {
      tRArr = await this.filterByRating(Number(query.rating), tRArr);
    }

    const dto = new GetAllTripRequestResponseDto();
    dto.tripRequests = tRArr.map((tR) => {
      return convertTripRequestToGetDto(tR);
    });
    return dto;
  }

  @Delete(':id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'deletes the trip request by id. Only if the requester is the logged in user.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async delete(@Param('id', ParseIntPipe) tripRequestId: number, @Session() session: ISession) {
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
    description: 'Updates the params of a transit request. Logged in user must be the requester.',
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
  async findCargoImage(@Param('imagename') imagename: string, @Res() res: Response) {
    try {
      const imagePath = join(process.cwd(), 'uploads', 'cargo-images', imagename);
      res.sendFile(imagePath);
    } catch (error) {
      return new InternalServerErrorException('Image not found');
    }
  }

  @Post('offering/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Send an offer to the requester of the request with the given ID.',
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
      throw new ForbiddenException('You are not allowed to make a offering to your own trip request!');
    }

    const check = await this.requestService.userAlreadyPostedAOfferingToThisTripRequest(
      offeringUserId,
      requestId,
    );
    if (check) {
      throw new ForbiddenException('You already sent a offering to this trip request!');
    }

    const offering = new TripRequestOffering();
    offering.offeringUser = offeringUser;
    offering.tripRequest = tR;
    offering.text = body.text;
    offering.requestedCoins = body.requestedCoins;

    await this.offeringService.save(offering);

    this.messageGatewayService.reloadMessages(tR.requester.id);

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
    const offerings = await this.offeringService.getAllPendingOfOfferingUser(userId);

    return this.convertToGetOfferingDtoArr(offerings);
  }

  @Get('offerings/requesting-user')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Gets all pending Offerings for which trip request you are the requester',
  })
  @ApiResponse({ type: [GetOfferingDto] })
  async getOfferingsAsRequestingUser(@Session() session: ISession) {
    const userId: number = session.userData.id;
    const offerings = await this.offeringService.getAllPendingOfRequestingUser(userId);

    return this.convertToGetOfferingDtoArr(offerings);
  }

  @Post('offering/accept/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description:
      'Accepts a offering with the given id. And executes the payment action if the user has enough coins.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async acceptOffering(@Session() session: ISession, @Param('id', ParseIntPipe) offeringId: number) {
    const userId: number = session.userData.id;
    const offering = await this.offeringService.getById(offeringId);
    if (offering.tripRequest.requester.id !== userId) {
      throw new ForbiddenException('You are not allowed to accept this offering!');
    }

    const coinbalanceOfRequester = await this.userService.getCoinBalanceOfUser(userId);
    if (coinbalanceOfRequester < offering.requestedCoins) {
      throw new ForbiddenException('The coin balance of the requesting user is not valid.');
    }

    const conversation = await this.messageService.getOrCreateConversation(
      offering.tripRequest.requester.id,
      offering.offeringUser.id,
    );

    const message = new Message();
    message.sender = offering.tripRequest.requester;
    message.conversation = conversation;
    message.timestamp = new Date();
    message.message = this.writeAcceptMessage(offering);
    await this.messageService.createMessage(message);

    offering.accepted = true;
    await this.offeringService.save(offering);

    await this.userService.decreaseCoinBalanceOfUser(userId, offering.requestedCoins);
    await this.userService.increaseCoinBalanceOfUser(offering.offeringUser.id, offering.requestedCoins);

    this.messageGatewayService.reloadMessages(offering.tripRequest.requester.id);
    this.messageGatewayService.reloadMessages(offering.offeringUser.id);

    return new OKResponseWithMessageDTO(true, 'Offering was accepted.');
  }

  @Post('offering/decline/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Declines a offering with the given id.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async decline(@Session() session: ISession, @Param('id', ParseIntPipe) offeringId: number) {
    const userId: number = session.userData.id;
    const offering = await this.offeringService.getById(offeringId);
    if (offering.tripRequest.requester.id !== userId) {
      throw new ForbiddenException('You are not allowed to decline this offering!');
    }

    const conversation = await this.messageService.getOrCreateConversation(
      offering.tripRequest.requester.id,
      offering.offeringUser.id,
    );

    const offeringUserId = offering.offeringUser.id;
    const requestingUser = offering.tripRequest.requester.id;

    const message = new Message();
    message.sender = offering.tripRequest.requester;
    message.conversation = conversation;
    message.timestamp = new Date();
    message.message = this.writeDeclineMessage(offering);
    await this.messageService.createMessage(message);
    await this.offeringService.delete(offering);

    this.messageGatewayService.reloadMessages(requestingUser);
    this.messageGatewayService.reloadMessages(offeringUserId);

    return new OKResponseWithMessageDTO(true, 'Offering was declined.');
  }

  @Delete('offering/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Deletes a offering with the given id.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async deleteOffering(@Session() session: ISession, @Param('id', ParseIntPipe) offeringId: number) {
    const userId: number = session.userData.id;
    const offering = await this.offeringService.getById(offeringId);
    const tR = await this.requestService.getById(offering.tripRequest.id);
    if (offering.offeringUser.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this offering!');
    }

    const offeringUserId = offering.offeringUser.id;
    await this.offeringService.delete(offering);

    this.messageGatewayService.reloadMessages(tR.requester.id);
    this.messageGatewayService.reloadMessages(offeringUserId);

    return new OKResponseWithMessageDTO(true, 'Offering was deleted.');
  }

  @Post('transform-to-offer/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    description: 'Transforms a TripRequest, with an accepted Offering to an Offer.',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async transformToOffer(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) requestId: number,
    @Body() body: PostTransformToOfferDto,
  ) {
    const userId: number = session.userData.id;

    const tR = await this.requestService.getWhereOfferingFromUserIsAccepted(userId, requestId);

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
  async notTransform(@Session() session: ISession, @Param('id', ParseIntPipe) requestId: number) {
    const userId: number = session.userData.id;

    const tR = await this.requestService.getWhereOfferingFromUserIsAccepted(userId, requestId);

    await this.requestService.delete(tR);

    return new OKResponseWithMessageDTO(true, 'Offering was deleted.');
  }

  private async convertToOffer(
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
    offer.vehicle = await this.vehicleService.getVehicle(data.vehicleId, provider.id);
    offer.startDate = new Date(data.startDate);
    offer.description = data.description;

    const offerDb = await this.offerService.saveOffer(offer);

    if (data.route) {
      data.route.map(async (routePartDto) => {
        const plz = await this.plzService.createPlz(routePartDto.plz, routePartDto.location);
        const routePart = await createRoutePart(offerDb, plz, routePartDto.position);
        await this.offerService.saveRoutePart(routePart);
      });
    }

    if (!data.route) {
      const plz1 = await this.plzService.createPlz(tripRequest.startPlz.plz, tripRequest.startPlz.location);
      const plz2 = await this.plzService.createPlz(tripRequest.endPlz.plz, tripRequest.endPlz.location);
      const routePart1 = await createRoutePart(offerDb, plz1, 1);
      const routePart2 = await createRoutePart(offerDb, plz2, 2);
      await this.offerService.saveRoutePart(routePart1);
      await this.offerService.saveRoutePart(routePart2);
    }
  }

  private convertToGetOfferingDtoArr(offerings: TripRequestOffering[]): GetOfferingDto[] {
    return offerings.map((o) => {
      return this.convertToGetOfferingDto(o);
    });
  }

  private convertToGetOfferingDto(offering: TripRequestOffering): GetOfferingDto {
    const dto = new GetOfferingDto();
    dto.id = offering.id;
    dto.offeringUser = convertUserToOtherUser(offering.offeringUser);
    dto.tripRequest = convertTripRequestToGetDto(offering.tripRequest);
    dto.text = offering.text;
    dto.requestedCoins = offering.requestedCoins;
    dto.accepted = offering.accepted;
    return dto;
  }

  private loggedInUserIsRequester(userId: number, tripRequest: TripRequest) {
    if (userId !== tripRequest.requester.id) {
      throw new ForbiddenException('You are not the requester of this trip request.');
    }
  }

  private async createTripRequest(
    dto: PostTripRequestRequestDto,
    user: User,
    cargoImg?: Express.Multer.File,
  ) {
    const tR = new TripRequest();

    if (cargoImg) {
      tR.cargoImg = cargoImg.filename;
    }

    tR.requester = user;

    tR.startPlz = await this.plzService.createPlz(dto.startPlz.plz, dto.startPlz.location);
    tR.endPlz = await this.plzService.createPlz(dto.endPlz.plz, dto.endPlz.location);

    tR.startDate = new Date(dto.startDate);

    tR.description = dto.description;
    tR.seats = Number(dto.seats);

    return tR;
  }

  private async updateTripRequest(tR: TripRequest, updateData: UpdateTripRequestRequestDto) {
    if (updateData.description) {
      tR.description = updateData.description;
    }

    if (updateData.startPlz) {
      tR.startPlz = await this.plzService.createPlz(updateData.startPlz.plz, updateData.startPlz.location);
    }

    if (updateData.endPlz) {
      tR.endPlz = await this.plzService.createPlz(updateData.endPlz.plz, updateData.endPlz.location);
    }

    if (updateData.cargoImgString) {
      tR.cargoImg = updateData.cargoImgString;
    }

    if (updateData.startDate) {
      tR.startDate = new Date(updateData.startDate);
    }

    return tR;
  }

  private deletePicture(imageName: string) {
    const oldImagePath = join(process.cwd(), 'uploads', 'cargo-images', imageName);
    if (!existsSync(oldImagePath)) {
      throw new NotFoundException('The picture to delete could not be found.');
    }

    unlinkSync(oldImagePath);
  }

  private filterRequestsBySeats(seats: number, tripRequests: TripRequest[]): TripRequest[] {
    return tripRequests.filter((tR) => tR.seats <= seats);
  }

  private filterAndSortByDate(date: Date, tripRequests: TripRequest[]) {
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

  private filterStartByPlz(startPlz: string, tripRequests: TripRequest[]) {
    return tripRequests.filter((tR) => tR.startPlz.plz === startPlz);
  }

  private filterEndByPlz(endPlz: string, tripRequests: TripRequest[]) {
    return tripRequests.filter((tR) => tR.endPlz.plz === endPlz);
  }

  private filterStartToEndPlz(fromPlz: string, toPlz: string, tripRequests: TripRequest[]): TripRequest[] {
    return tripRequests.filter((tR) => {
      return tR.endPlz.plz === toPlz && tR.startPlz.plz === fromPlz;
    });
  }
  private async filterByRating(rating: number, tripRequests: TripRequest[]) {
    const cache = new Map<number, number>();
    const filteredTripeRequests: TripRequest[] = [];

    for (const tr of tripRequests) {
      const providerId = tr.requester.id;
      let foundRating: number | undefined = undefined;

      if (cache.has(providerId)) {
        foundRating = cache.get(providerId);
      }

      if (foundRating == undefined) {
        const avgRatings = await this.ratingService.selectAverageRatingForUser(providerId);
        foundRating = avgRatings.total;
        cache.set(providerId, foundRating);
      }

      if (foundRating <= rating && foundRating > rating - 1) {
        filteredTripeRequests.push(tr);
      }
    }

    return filteredTripeRequests;
  }

  private writeDeclineMessage(offering: TripRequestOffering): string {
    const start = offering.tripRequest.startPlz.location;
    const end = offering.tripRequest.endPlz.location;
    const coins = offering.requestedCoins.toString();

    return `Ich habe dein Angebot, mich von ${start} nach ${end} für ${coins} Coins mit zu nehmen, abgelehnt. (automatisierte Nachricht)`;
  }

  private writeAcceptMessage(offering: TripRequestOffering): string {
    const start = offering.tripRequest.startPlz.location;
    const end = offering.tripRequest.endPlz.location;
    const coins = offering.requestedCoins.toString();

    return `Ich habe dein Angebot, mich von ${start} nach ${end} für ${coins} Coins mit zu nehmen, angenommen. (automatisierte Nachricht)`;
  }
}
