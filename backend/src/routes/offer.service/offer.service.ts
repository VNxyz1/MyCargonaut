import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateOfferDto} from "../offer/DTOs/CreateOfferDto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../database/User";
import {Repository} from "typeorm";
import {Offer} from "../../database/Offer";
import {Plz} from "../../database/Plz";
import {CreatePlzDto} from "../offer/DTOs/CreatePlzDto";
import {Like} from "typeorm";
import {UpdateOfferRequestDto} from "../offer/DTOs/UpdateOfferRequestDto";
import {TripState} from "../../database/TripState";
import {TransitRequest} from "../../database/TransitRequest";

@Injectable()
export class OfferService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Plz)
        private readonly plzRepository: Repository<Plz>,
        @InjectRepository(TransitRequest)
        private readonly transitRequestRepository: Repository<TransitRequest>,
    ) {
    }

    async postOffer(providerId: number, offerDto: CreateOfferDto) {
        const offer = this.offerRepository.create(offerDto);

        offer.provider = await this.userRepository.findOne({where: {id: providerId}});

        offer.state = TripState.offer;

        const offerDb = await this.offerRepository.save(offer)

        for (let plzDto of offerDto.route) {
            await this.createPlzAndPush(offerDb, plzDto);
        }
        return offerDb
    }

    async checkIfPlzIsDuplicate(plzDto: CreatePlzDto): Promise<Plz | null> {
        return await this.plzRepository.findOne({where: {plz: plzDto.plz}, relations: ["offers"]});
    }


    async getOffers(searchFor?: string) {

        if (searchFor) {
            return await this.offerRepository.find({where: {description: Like(`%${searchFor}%`),}, relations: ["provider", "route", "clients", "transitRequests"]})
        }

        return await this.offerRepository.createQueryBuilder('offer')
            .leftJoinAndSelect('offer.provider', 'provider')
            .leftJoinAndSelect('offer.route', 'route')
            .leftJoinAndSelect('offer.clients', 'clients')
            .leftJoinAndSelect('offer.transitRequests', 'transitRequests')
            .getMany();

    }

    async getOffersOfUser(userId: number) {
        return await this.offerRepository.createQueryBuilder('offer')
            .leftJoinAndSelect('offer.provider', 'provider')
            .leftJoinAndSelect('offer.route', 'route')
            .leftJoinAndSelect('offer.clients', 'clients')
            .leftJoinAndSelect('offer.transitRequests', 'transitRequests')
            .where('offer.provider.id = :userId', {
                userId: userId
            })
            .getMany();
    }

    async getOffer(id: number) {
        const offer = await this.offerRepository.findOne({where: {id: id}, relations: ["provider", "route", "clients", "transitRequests"]});
        if (!offer) {
            throw new InternalServerErrorException("Offer was not found!");
        }
        return offer
    }


    private async createPlzAndPush(offer: Offer, plzDto: CreatePlzDto) {
        const checkPlz = await this.checkIfPlzIsDuplicate(plzDto);

        if (!checkPlz) {
            const plz = new Plz();
            plz.offers = [];
            plz.offers.push(offer);
            plz.plz = plzDto.plz;
            await this.plzRepository.save(plz);
        } else {
            checkPlz.offers.push(offer);
            offer.route.push(checkPlz);
            await this.plzRepository.save(checkPlz);
            await this.offerRepository.save(offer);
        }
    }

    async updateOffer(updateData: UpdateOfferRequestDto, offer: Offer) {
        if (updateData.route) {
            offer.route = [];
            for (let plzDto of updateData.route) {
                await this.createPlzAndPush(offer, plzDto)
            }
        }

        if (updateData.description) {
            offer.description = updateData.description;
        }

        if (updateData.startDate) {
            offer.startDate = updateData.startDate;
        }

        await this.offerRepository.save(offer);
    }

    async deleteOffer(offer: Offer) {
        for (const tR of offer.transitRequests) {
            await this.transitRequestRepository.remove(tR);
        }

        const plzArr = await this.plzRepository.find({where: {}, relations: ['offers']});
        for (const plz of plzArr) {
            plz.offers = plz.offers.filter((o) => o.id !== offer.id);
            await this.plzRepository.save(plz);
        }

        await this.offerRepository.remove(offer);
    }


}