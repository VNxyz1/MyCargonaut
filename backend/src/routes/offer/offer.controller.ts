import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Session,
    UseGuards
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {OfferService} from "../offer.service/offer.service";
import {OKResponseWithMessageDTO} from "../../generalDTOs/OKResponseWithMessageDTO";
import {CreateOfferDto} from "./DTOs/CreateOfferDto";
import {ISession} from "../../utils/ISession";
import {IsLoggedInGuard} from "../../guards/auth/is-logged-in.guard";
import {GetAllOffersResponseDto} from "./DTOs/GetAllOffersResponseDto";
import {Offer} from "../../database/Offer";
import {GetOfferResponseDto} from "./DTOs/GetOfferResponseDto";
import {User} from "../../database/User";
import {GetOtherUserDto} from "./DTOs/GetOtherUserDto";
import {UpdateOfferRequestDto} from "./DTOs/UpdateOfferRequestDto";

@ApiTags('offer')
@Controller('offer')
export class OfferController {

    constructor(private readonly offerService: OfferService) {
    }

    @Post()
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({summary: 'Creates a new Offer'})
    @ApiResponse({type: OKResponseWithMessageDTO})
    async postUser(
        @Body() body: CreateOfferDto,
        @Session() session: ISession,
        ) {
        const userId = session.userData.id;
        await this.offerService.postOffer(userId, body);
        return new OKResponseWithMessageDTO(true, 'Offer Created');
    }

    @Get()
    @ApiOperation({summary: "gets all offers"})
    @ApiResponse({type: GetAllOffersResponseDto})
    async getAllOffers() {
        const offerList =  await this.offerService.getOffers();
        const offerListDto = new GetAllOffersResponseDto();
        offerListDto.offerList = [];
        for (let offer of offerList) {
            const converteOffer = this.convertOfferToGetOfferDto(offer);
            offerListDto.offerList.push(converteOffer);
        }

        return offerListDto;
    }

    @Get("own")
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({summary: "gets offers of logged in user"})
    @ApiResponse({type: GetAllOffersResponseDto})
    async getOffersOfLoggedInUser(
        @Session() session: ISession,
    ) {
        const userId = session.userData.id;
        const offerList =  await this.offerService.getOffersOfUser(userId);
        const offerListDto = new GetAllOffersResponseDto();
        offerListDto.offerList = [];
        for (let offer of offerList) {
            const converteOffer = this.convertOfferToGetOfferDto(offer);
            offerListDto.offerList.push(converteOffer);
        }

        return offerListDto;
    }

    @Get("search/:searchString")
    @ApiOperation({summary: "gets offers, filtered by a string (searches in the description)"})
    @ApiResponse({type: GetAllOffersResponseDto})
    async getFilteredOffers(
        @Param("searchString") searchString: string,
    ) {
        const offerList =  await this.offerService.getOffers(searchString);
        const offerListDto = new GetAllOffersResponseDto();
        offerListDto.offerList = [];
        for (let offer of offerList) {
            const converteOffer = this.convertOfferToGetOfferDto(offer);
            offerListDto.offerList.push(converteOffer);
        }

        return offerListDto;
    }

    @Put(":id")
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({ summary: 'Updates the selected Offer. Only if the Logged in User is the Provider' })
    @ApiResponse({ type: OKResponseWithMessageDTO })
    async updateOffer(
        @Session() session: ISession,
        @Param("id", ParseIntPipe) offerId: number,
        @Body() body: UpdateOfferRequestDto
    ) {
        const userId = session.userData.id;
        const offer = await this.offerService.getOffer(offerId);
        if (offer.provider.id !== userId) {
            throw new BadRequestException("You are not the Provider of this Offer!")
        }
        await this.offerService.updateOffer(body, offer);
        return new OKResponseWithMessageDTO(true, "Offer Updated")
    }





    convertOfferToGetOfferDto(offer: Offer) {
        const getOfferResponseDto: GetOfferResponseDto = {
            id: offer.id,
            provider: this.convertUserToOtherUser(offer.provider),
            route: offer.route,
            createdAt: offer.createdAt,
            clients: offer.clients.map(client => this.convertUserToOtherUser(client)),
            vehicle: offer.vehicle,
            bookedSeats: offer.bookedSeats,
            state: offer.state,
            description: offer.description,
            startDate: offer.startDate,
        };

        return getOfferResponseDto;
    }

    convertUserToOtherUser(user: User) {
        const otherUserDto: GetOtherUserDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
        };

        return otherUserDto;
    }

}
