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
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {OfferService} from '../offer.service/offer.service';
import {OKResponseWithMessageDTO} from '../../generalDTOs/OKResponseWithMessageDTO';
import {CreateOfferDto} from './DTOs/CreateOfferDto';
import {ISession} from '../../utils/ISession';
import {IsLoggedInGuard} from '../../guards/auth/is-logged-in.guard';
import {GetAllOffersResponseDto} from './DTOs/GetAllOffersResponseDto';
import {UpdateOfferRequestDto} from './DTOs/UpdateOfferRequestDto';
import {convertOfferToGetOfferDto} from '../utils/convertToOfferDto';
import {User} from '../../database/User';
import {TripState} from "../../database/TripState";
import {Offer} from "../../database/Offer";

@ApiTags('offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Creates a new Offer' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async postUser(@Body() body: CreateOfferDto, @Session() session: ISession) {
    this.userHasProfilePicAndPhoneNumber(session.userData);

    const userId = session.userData.id;
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

  @Get('search')
  @ApiOperation({
    summary:
      'gets offers, filtered by a string (searches in the description, plz, location)',
  })
  @ApiResponse({ type: GetAllOffersResponseDto })
  async getFilteredOffers(
      @Query('search') searchString?: string,
      @Query('fromPLZ') fromPLZ?: string,
      @Query('toPLZ') toPLZ?: string,
      @Query('seats', ParseIntPipe) seats?: number,
      @Query('date') date?: string,
      @Query('rating', ParseIntPipe) rating?: number,
  ) {
    let offerList: Offer[];

    if (searchString) {
      offerList = await this.offerService.getOffers(searchString);
    } else {
      offerList = await this.offerService.getOffers();
    }

    if (seats) {
      offerList = this.filterOffersBySeats(seats, offerList);
    }

    if (rating) {
      offerList = this.filterOffersByRating(rating, offerList)
    }

    if (date) {
      const formattedDate = new Date(date)
      offerList = this.filterAndSortByDate(formattedDate, offerList)
    }

    if (fromPLZ && toPLZ) {
      offerList = this.filterOffersByPLZ(fromPLZ, toPLZ, offerList);
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
  async deleteOffer(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) offerId: number,
  ) {
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
    summary:
        'Sets the selected Offer as "booked up". Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async setOfferAsBookedUp(
      @Session() session: ISession,
      @Param('id', ParseIntPipe) offerId: number,
  ) {
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
    summary:
        'Reopens the selected offer. Only if the Logged in User is the Provider',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async reopenOffer(
      @Session() session: ISession,
      @Param('id', ParseIntPipe) offerId: number,
  ) {
    const userId = session.userData.id;
    const offer = await this.offerService.getOffer(offerId);
    if (offer.provider.id !== userId) {
      throw new BadRequestException('You are not the Provider of this Offer!');
    }

    offer.state = TripState.offer;

    await this.offerService.saveOffer(offer);
    return new OKResponseWithMessageDTO(true, 'Offer is reopened');
  }


  userHasProfilePicAndPhoneNumber(user: User) {
    let bothExisting: boolean;
    if (user.profilePicture && user.phoneNumber) {
      bothExisting = user.profilePicture !== '' && user.phoneNumber !== '';
    }

    if (!bothExisting) {
      throw new ForbiddenException(
        'Add a profile picture and phone number to your profile to proceed.',
      );
    }

    return bothExisting;
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
    return offers.filter((o)=> {
      return o.bookedSeats /* TODO: muss mit den sitzen des fahrzeugs verrechnet werden */ === seats
    })
  }

  filterOffersByRating(rating: number, offers: Offer[]): Offer[] {
    return offers.filter((o)=> {
      /* TODO: implement logic */
    })
  }



  //TODO: test this function
  filterAndSortByDate(date: Date, offers: Offer[]) {
    const filteredOffers = offers.filter((o) => {
      return o.startDate <= date;
    });

    filteredOffers.sort((a, b) => {
      const aDateNumber = a.startDate.getTime();
      const bDateNumber = b.startDate.getTime();
      return aDateNumber - bDateNumber;
    });

    return filteredOffers;
  }


}
