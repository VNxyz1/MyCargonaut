import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransitRequestService } from '../transit-request.service/transit-request.service';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ISession } from '../../utils/ISession';
import { OfferService } from '../offer.service/offer.service';
import { Offer } from '../../database/Offer';
import { UserService } from '../user.service/user.service';
import { User } from '../../database/User';
import { PutTransitRequestRequestDto } from './DTOs/PutTransitRequestRequestDto';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { GetAllPendingTransitRequestsResponseDTO } from './DTOs/GetAllPendingTransitRequestsResponseDTO';
import { convertOfferToGetOfferDto } from '../utils/convertToOfferDto';
import { GetTransitRequestDto } from './DTOs/getTransitRequestDto';
import { PostTransitRequestRequestDto } from './DTOs/PostTransitRequestRequestDto';
import { TransitRequest } from '../../database/TransitRequest';

@ApiTags('transit-request')
@Controller('transit-request')
export class TransitRequestController {
  constructor(
    private readonly transitRequestService: TransitRequestService,
    private readonly offerService: OfferService,
    private readonly userService: UserService,
  ) {}

  @Post(':id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Sends a Transit request',
    description: `Allows a logged-in user to send a transit request for a specific offer.`,
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  @ApiResponse({
    status: 200,
    type: OKResponseWithMessageDTO,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden: Cannot request your own offer.',
  })
  async postTransitRequest(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) offerId: number,
    @Body() body: PostTransitRequestRequestDto,
  ) {
    const offer: Offer = await this.offerService.getOffer(offerId);
    const requestingUserId = session.userData.id;
    if (requestingUserId === offer.provider.id) {
      throw new ForbiddenException(
        'You are not allowed to make a request to your own offer',
      );
    }
    const requestingUser: User =
      await this.userService.getUserById(requestingUserId);
    await this.transitRequestService.postTransitRequest(
      offer,
      requestingUser,
      body,
    );
    return new OKResponseWithMessageDTO(true, 'Request was sent');
  }

  @Get('all')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Gets all pending transit requests sent by the logged-in user',
  })
  @ApiResponse({
    status: 200,
    type: GetAllPendingTransitRequestsResponseDTO,
    description: 'Returns a list of pending transit requests.',
  })
  @ApiResponse({ type: GetAllPendingTransitRequestsResponseDTO })
  async getPendingTransitRequestOfLoggedInUser(@Session() session: ISession) {
    const userId = session.userData.id;

    const requests =
      await this.transitRequestService.getAllTransitRequestsOfUser(userId);

    const response = new GetAllPendingTransitRequestsResponseDTO();
    response.transitRequests = requests.map((tR) => {
      const tRDto = new GetTransitRequestDto();
      tRDto.offer = convertOfferToGetOfferDto(tR.offer);
      tRDto.requester = tR.requester;
      tRDto.id = tR.id;
      tRDto.offeredCoins = tR.offeredCoins;
      tRDto.requestedSeats = tR.requestedSeats;
      tRDto.text = tR.text;
      return tRDto;
    });

    return response;
  }

  @Get('received')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Gets all pending transit requests received by the logged-in user',
  })
  @ApiResponse({
    status: 200,
    type: GetAllPendingTransitRequestsResponseDTO,
    description: 'Returns a list of pending transit requests.',
  })
  @ApiResponse({ type: GetAllPendingTransitRequestsResponseDTO })
  async getPendingTransitrequestLoggedInUserRecived(
    @Session() session: ISession,
  ) {
    const userId = session.userData.id;

    const requests =
      await this.transitRequestService.getAllRecivedTransitRequestsOfUser(
        userId,
      );

    const response = new GetAllPendingTransitRequestsResponseDTO();
    response.transitRequests = requests.map((tR) => {
      const tRDto = new GetTransitRequestDto();
      tRDto.offer = convertOfferToGetOfferDto(tR.offer);
      tRDto.requester = tR.requester;
      tRDto.id = tR.id;
      tRDto.offeredCoins = tR.offeredCoins;
      tRDto.requestedSeats = tR.requestedSeats;
      tRDto.text = tR.text;
      return tRDto;
    });

    return response;
  }

  @Put('update-params/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary:
      'Updates the offered coins and/or requested seats of a Transit request',
    description: `Allows the requester to update the offered coins and/or requested seats of their transit request.`,
  })
  @ApiResponse({
    status: 200,
    type: OKResponseWithMessageDTO,
    description: 'Request was updated successfully.',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestException,
    description: 'Bad Request: Provide at least one of both props.',
  })
  async putTransitRequest(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) offerId: number,
    @Body() body: PutTransitRequestRequestDto,
  ) {
    if (!body.requestedSeats && !body.offeredCoins) {
      throw new BadRequestException(
        'Please provide at least one of both props',
      );
    }

    const offer: Offer = await this.offerService.getOffer(offerId);
    const requestingUserId = session.userData.id;

    const requestingUser: User =
      await this.userService.getUserById(requestingUserId);

    await this.transitRequestService.putTransitRequest(
      offer,
      requestingUser,
      body,
    );

    return new OKResponseWithMessageDTO(true, 'Request was updated');
  }

  @Put('accept/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Accepts a Transit Request and processes the transaction',
    description: `Allows the provider to accept a transit request, updating coin balances accordingly.`,
  })
  @ApiResponse({
    status: 200,
    type: OKResponseWithMessageDTO,
    description: 'Request was accepted successfully.',
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden: Cannot mark this request as accepted.',
  })
  async acceptRequest(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) tRId: number,
  ) {
    const offerProviderId = session.userData.id;
    const tR = await this.transitRequestService.getTransitRequestById(tRId);

    const offer = await this.offerService.getOffer(tR.offer.id);

    if (offer.provider.id !== offerProviderId) {
      throw new ForbiddenException(
        'You are not allowed to mark this request as accepted',
      );
    }

    const coinbalanceOfRequester = await this.userService.getCoinBalanceOfUser(
      tR.requester.id,
    );
    if (coinbalanceOfRequester < tR.offeredCoins) {
      throw new ForbiddenException(
        'The coin balance of the requesting user is not valid.',
      );
    }
    await this.transitRequestService.acceptTransitRequest(tR);

    await this.userService.decreaseCoinBalanceOfUser(
      tR.requester.id,
      tR.offeredCoins,
    );
    await this.userService.increaseCoinBalanceOfUser(
      offerProviderId,
      tR.offeredCoins,
    );

    return new OKResponseWithMessageDTO(true, 'Request was accepted');
  }

  @Delete(':id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Deletes a transit request if the logged-in user is the requester',
    description: `Allows the requester to delete their transit request.`,
  })
  @ApiResponse({
    status: 200,
    type: OKResponseWithMessageDTO,
    description: 'Request was deleted successfully.',
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden: Cannot delete this request.',
  })
  async deleteTransitRequest(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) tRId: number,
  ) {
    const tR = await this.transitRequestService.getTransitRequestById(tRId);

    const requestingUserId = session.userData.id;

    if (!this.loggedInUserIsRequestingUser(requestingUserId, tR)) {
      throw new ForbiddenException(
        'You are not allowed to delete this Request.',
      );
    }

    await this.transitRequestService.delete(tR);
    return new OKResponseWithMessageDTO(true, 'Request was deleted');
  }

  loggedInUserIsRequestingUser(userId: number, tR: TransitRequest): boolean {
    return tR.requester.id === userId;
  }
}
