import {
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
import {TransitRequestService} from "../transit-request.service/transit-request.service";
import {IsLoggedInGuard} from "../../guards/auth/is-logged-in.guard";
import {ISession} from "../../utils/ISession";
import {OfferService} from "../offer.service/offer.service";
import {Offer} from "../../database/Offer";
import {UserService} from "../user.service/user.service";
import {User} from "../../database/User";
import {PostAndPutTransitRequestRequestDto} from "./DTOs/postAndPutTransitRequestRequestDto";
import {OKResponseWithMessageDTO} from "../../generalDTOs/OKResponseWithMessageDTO";
import {GetAllPendingTransitRequestsResponseDTO} from "./DTOs/GetAllPendingTransitRequestsResponseDTO";
import {convertOfferToGetOfferDto} from "../utils/convertToOfferDto";
import {GetTransitRequestDto} from "./DTOs/getTransitRequestDto";

@ApiTags('transit-request')
@Controller('transit-request')
export class TransitRequestController {

    constructor(
        private readonly transitRequestService: TransitRequestService,
        private readonly offerService: OfferService,
        private readonly userService: UserService,
    ) {
    }

    @Post(':id')
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({ summary: 'Sends a Transit request' })
    @ApiResponse({ type: OKResponseWithMessageDTO })
    async postTransitRequest(
        @Session() session: ISession,
        @Param('id', ParseIntPipe) offerId: number,
        @Body() body: PostAndPutTransitRequestRequestDto
    ) {

        //Todo: überprüfung der coin balance erst wenn die fahrt "gekauft" wird

        const offer: Offer = await this.offerService.getOffer(offerId);
        const requestingUserId = session.userData.id;
        const requestingUser: User = await this.userService.getUserById(requestingUserId);
        await this.transitRequestService.postTransitRequest(offer, requestingUser, body.offeredCoins);
        return new OKResponseWithMessageDTO(true, 'Request was sent')
    }

    @Get('all')
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({summary: 'gets all pending transit requests, the logged in user sent'})
    @ApiResponse({type: GetAllPendingTransitRequestsResponseDTO})
    async getPendingTransitrequestOfLoggedInUser(
        @Session() session: ISession,
    ) {
        const userId = session.userData.id;

        const requests = await this.transitRequestService.getAllTransitRequestsOfUser(userId);

        const response = new GetAllPendingTransitRequestsResponseDTO();
        response.transitRequests = requests.map((tR)=> {
            const tRDto = new GetTransitRequestDto();
            tRDto.offer = convertOfferToGetOfferDto(tR.offer);
            tRDto.requester = tR.requester;
            tRDto.id = tR.id;
            tRDto.offeredCoins = tR.offeredCoins;
            return tRDto;
        });

        return response
    }

    @Put(':id')
    @UseGuards(IsLoggedInGuard)
    @ApiOperation({ summary: 'Sends a Transit request' })
    @ApiResponse({ type: OKResponseWithMessageDTO })
    async putTransitRequest(
        @Session() session: ISession,
        @Param('id', ParseIntPipe) offerId: number,
        @Body() body: PostAndPutTransitRequestRequestDto
    ) {

        const offer: Offer = await this.offerService.getOffer(offerId);
        const requestingUserId = session.userData.id;

        const requestingUser: User = await this.userService.getUserById(requestingUserId);

        await this.transitRequestService.putTransitRequest(offer, requestingUser, body.offeredCoins);
        return new OKResponseWithMessageDTO(true, 'Request was updated')
    }

}
