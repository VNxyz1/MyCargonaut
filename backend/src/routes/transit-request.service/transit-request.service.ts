import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../database/User";
import {Repository} from "typeorm";
import {Offer} from "../../database/Offer";
import {Plz} from "../../database/Plz";
import {TransitRequest} from "../../database/TransitRequest";

@Injectable()
export class TransitRequestService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Plz)
        private readonly plzRepository: Repository<Plz>,
        @InjectRepository(TransitRequest)
        private readonly transitRequestRepository: Repository<TransitRequest>,
    ) {}

    async postTransitRequest(offer: Offer, requestingUser: User, coinOffer: number) {
        const transitRequestCheck = await this.findTransitRequestWithOfferAndRequester(requestingUser, offer);

        if(transitRequestCheck) {
            throw new BadRequestException("There already is a pending request!")
        }

        let transitRequest = this.transitRequestRepository.create();
        transitRequest.requester = requestingUser;
        transitRequest.offeredCoins = coinOffer;
        transitRequest.offer = offer;
        transitRequest = await this.transitRequestRepository.save(transitRequest);
        offer.transitRequests.push(transitRequest)
        await this.offerRepository.save(offer);
    }

    async putTransitRequest(offer: Offer, requestingUser: User, coinOffer: number) {

        let transitRequest = await this.findTransitRequestWithOfferAndRequester(requestingUser, offer);

        if(!transitRequest) {
            throw new NotFoundException("No matching request found")
        }

        transitRequest.offeredCoins = coinOffer;
        transitRequest = await this.transitRequestRepository.save(transitRequest);
        offer.transitRequests.push(transitRequest)
        await this.offerRepository.save(offer);
    }

    async getAllTransitRequestsOfUser(userId: number) {
        const transitRequests = await this.transitRequestRepository
            .createQueryBuilder('transitRequest')
            .leftJoinAndSelect('transitRequest.requester', 'requester')
            .leftJoinAndSelect('transitRequest.offer', 'offer')
            .leftJoinAndSelect('offer.provider', 'provider')
            .leftJoinAndSelect('offer.route', 'route')
            .leftJoinAndSelect('offer.clients', 'clients')
            .where('transitRequest.requester.id = :userId', { userId })
            .getMany();
        if(!transitRequests) {
            throw new NotFoundException("No pending transit requests found")
        }
        return transitRequests
    }

    private async findTransitRequestWithOfferAndRequester(requestingUser: User, offer: Offer) {
        return await this.transitRequestRepository
            .createQueryBuilder('transitRequest')
            .leftJoinAndSelect('transitRequest.requester', 'requester')
            .leftJoinAndSelect('transitRequest.offer', 'offer')
            .where('transitRequest.requester.id = :userId AND transitRequest.offer.id = :offerId',
                {
                    userId: requestingUser.id,
                    offerId: offer.id
                })
            .getOne()
    }
}
