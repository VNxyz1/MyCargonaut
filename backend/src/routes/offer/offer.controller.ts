import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OfferService } from '../offer.service/offer.service';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateOfferDto } from './DTOs/CreateOfferDto';
import { ISession } from '../../utils/ISession';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { GetAllOffersResponseDto } from './DTOs/GetAllOffersResponseDto';
import { UpdateOfferRequestDto } from './DTOs/UpdateOfferRequestDto';
import { convertOfferToGetOfferDto, convertUserToOtherUser } from '../utils/convertToOfferDto';
import { TripState } from '../../database/TripState';
import { Offer } from '../../database/Offer';
import { GetOfferResponseDto } from './DTOs/GetOfferResponseDto';
import { UserService } from '../user.service/user.service';
import { userIsValidToBeProvider } from '../utils/userIsValidToBeProvider';
import { RatingService } from '../rating.service/rating.service';
import { GetFilteredOffersDto } from './DTOs/GetFilteredOffersDto';
import { GetOfferClientsDto } from './DTOs/GetOfferClientsDto';

@ApiTags('offer')
@Controller('offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
  ) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Creates a new Offer' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async postUser(@Body() body: CreateOfferDto, @Session() session: ISession) {
    const userId = session.userData.id;
    const user = await this.userService.getUserById(userId);
    userIsValidToBeProvider(user);

    await this.offerService.postOffer(userId, body);
    return new OKResponseWithMessageDTO(true, 'Offer Created');
  }

  @Get()
  @ApiOperation({ summary: 'gets all offers' })
  @ApiResponse({ type: GetAllOffersResponseDto })
  async getAllOffers() {
    const offerList = await this.offerService.getOffers();
    const offerListDto = new GetAllOffersResponseDto();
    offerListDto.offerList = [];
    for (const offer of offerList) {
      const convertOffer = convertOfferToGetOfferDto(offer);
      offerListDto.offerList.push(convertOffer);
    }

    return offerListDto;
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'gets offer by id' })
  @ApiResponse({ type: GetOfferResponseDto })
  async getOne(@Param('id', ParseIntPipe) tripRequestId: number) {
    const offer = await this.offerService.getOffer(tripRequestId);
    return convertOfferToGetOfferDto(offer);
  }

  @Get('own')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'gets offers of logged in user' })
  @ApiResponse({ type: GetAllOffersResponseDto })
  async getOffersOfLoggedInUser(@Session() session: ISession) {
    const userId = session.userData.id;
    const offerList = await this.offerService.getOffersOfUser(userId);
    const offerListDto = new GetAllOffersResponseDto();
    offerListDto.offerList = [];
    for (const offer of offerList) {
      const convertOffer = convertOfferToGetOfferDto(offer);
      offerListDto.offerList.push(convertOffer);
    }

    return offerListDto;
  }

  @Get('own/passenger')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'gets offers of logged in user as passenger',
  })
  @ApiResponse({ type: GetAllOffersResponseDto })
  async getOffersOfLoggedInUserAsPassenger(@Session() session: ISession) {
    const userId = session.userData.id;
    const offerList = await this.offerService.getOffersOfUserAsPassenger(userId);
    const offerListDto = new GetAllOffersResponseDto();
    offerListDto.offerList = [];
    for (const offer of offerList) {
      const convertOffer = convertOfferToGetOfferDto(offer);
      offerListDto.offerList.push(convertOffer);
    }

    return offerListDto;
  }

  @Get('search')
  @ApiOperation({
    summary: 'Gets offers that match a search string, including the description, location (plz), and date.',
    description:
      'Example request: "offers/search?search=test&fromPLZ=63679&toPLZ=64002&rating=4&date=2025-01-01".',
  })
  @ApiResponse({
    type: GetAllOffersResponseDto,
    description: 'An array of offers that match the search criteria.',
  })
  async getFilteredOffers(@Query() query: GetFilteredOffersDto) {
    let offerList: Offer[];

    if (query.searchString) {
      offerList = await this.offerService.getOffers(query.searchString);
    } else {
      offerList = await this.offerService.getOffers();
    }

    if (query.seats) {
      offerList = this.filterOffersBySeats(Number(query.seats), offerList);
    }

    if (query.rating) {
      offerList = await this.filterOffersByRating(Number(query.rating), offerList);
    }

    if (query.date) {
      const formattedDate = new Date(query.date);
      offerList = this.filterAndSortByDate(formattedDate, offerList);
    }

    if (query.fromPLZ && query.toPLZ) {
      offerList = this.filterOffersByPLZ(query.fromPLZ, query.toPLZ, offerList);
    }

    const offerListDto = new GetAllOffersResponseDto();
    offerListDto.offerList = [];
    for (const offer of offerList) {
      const convertOffer = convertOfferToGetOfferDto(offer);
      offerListDto.offerList.push(convertOffer);
    }

    return offerListDto;
  }

  @Put('props/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary:
      'Updates the selected Offer. Only the properties that are sent are updated. Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async updateOffer(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) offerId: number,
    @Body() body: UpdateOfferRequestDto,
  ) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }
    await this.offerService.updateOffer(body, offer);
    return new OKResponseWithMessageDTO(true, 'Offer Updated');
  }

  @Delete('delete/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Deletes Offer. Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async deleteOffer(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }
    await this.offerService.deleteOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Offer Deleted');
  }

  @Put('booked-up/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Sets the selected Offer as "booked up". Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async setOfferAsBookedUp(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }

    offer.state = TripState.bookedUp;

    await this.offerService.saveOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Offer is set as booked up');
  }

  @Put('reopen/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Reopens the selected offer. Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async reopenOffer(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }

    offer.state = TripState.offer;

    await this.offerService.saveOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Offer is reopened');
  }

  @Put('start-trip/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Marks an existing offer as started',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async startTrip(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOfferThatIsNotFinished(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }

    offer.state = TripState.inTransit;

    await this.offerService.saveOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Trip is marked as started');
  }

  @Put('end-trip/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Marks an existing offer as started',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async endTrip(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOfferThatIsInTransit(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }

    offer.state = TripState.finished;

    for(const client of offer.clients) {
      const amount = await this.offerService.getReservedCoinsForClient(client, offer);
      if(amount != null) {
        await this.userService.decreaseReservedCoinBalanceOfUser(client.id, amount);
        await this.userService.increaseCoinBalanceOfUser(offer.provider.id, amount);
      }
    }

    await this.offerService.saveOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Trip is marked as finished');
  }

  @Get('clients/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Retruns all clients for a offer only if user is provider',
  })
  async getClients(@Session() session: ISession, @Param('id', ParseIntPipe) offerId: number) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }
    const clients = new GetOfferClientsDto();
    clients.clients = [];
    offer.clients.forEach((element) => {
      clients.clients.push(convertUserToOtherUser(element));
    });
    return clients;
  }

  filterOffersByPLZ(fromPlz: string, toPlz: string, offers: Offer[]): Offer[] {
    return offers.filter((o) => {
      let fromPlzFound = false;
      let toPlzFound = false;
      let fromPlzIndex: number;
      let toPlzIndex: number;

      for (const routePart of o.route) {
        if (routePart.plz.plz === fromPlz && !fromPlzFound) {
          fromPlzFound = true;
          fromPlzIndex = routePart.position;
        }
        if (routePart.plz.plz === toPlz) {
          toPlzFound = true;
          toPlzIndex = routePart.position;
        }

        if (fromPlzFound && toPlzFound) {
          if (fromPlzIndex < toPlzIndex) {
            return true;
          }
        }
      }

      return false;
    });
  }

  filterOffersBySeats(seats: number, offers: Offer[]): Offer[] {
    return offers.filter((o) => {
      const availableSeats = o.vehicle.seats - o.bookedSeats;
      return availableSeats >= seats;
    });
  }

  async filterOffersByRating(rating: number, offers: Offer[]): Promise<Offer[]> {
    const cache = new Map<number, number>();
    const filteredOffers: Offer[] = [];

    for (const o of offers) {
      const providerId = o.provider.id;
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
        filteredOffers.push(o);
      }
    }

    return filteredOffers;
  }

  filterAndSortByDate(date: Date, offers: Offer[]) {
    const filteredOffers = offers.filter((o) => {
      return o.startDate >= date;
    });

    filteredOffers.sort((a, b) => {
      const aDateNumber = a.startDate.getTime();
      const bDateNumber = b.startDate.getTime();
      return aDateNumber - bDateNumber;
    });

    return filteredOffers;
  }
}
