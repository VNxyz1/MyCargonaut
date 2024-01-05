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
import { OfferService } from '../offer.service/offer.service';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateOfferDto } from './DTOs/CreateOfferDto';
import { ISession } from '../../utils/ISession';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { GetAllOffersResponseDto } from './DTOs/GetAllOffersResponseDto';
import { UpdateOfferRequestDto } from './DTOs/UpdateOfferRequestDto';
import { convertOfferToGetOfferDto } from '../utils/convertToOfferDto';
import { User } from '../../database/User';

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

  @Get('search/:searchString')
  @ApiOperation({
    summary:
      'gets offers, filtered by a string (searches in the description, plz, location)',
  })
  @ApiResponse({ type: GetAllOffersResponseDto })
  async getFilteredOffers(@Param('searchString') searchString: string) {
    const offerList = await this.offerService.getOffers(searchString);
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
}
