import {Injectable} from '@nestjs/common';
import {CreateOfferDto} from "../offer/DTOs/CreateOfferDto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../database/User";
import {Repository} from "typeorm";
import {Offer} from "../../database/Offer";
import {Plz} from "../../database/Plz";
import {CreatePlzDto} from "../offer/DTOs/CreatePlzDto";
import {Like} from "typeorm";

@Injectable()
export class OfferService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Plz)
        private readonly plzRepository: Repository<Plz>,
    ) {}

    async postOffer(providerId: number, offerDto: CreateOfferDto) {
        const offer = this.offerRepository.create(offerDto);

        offer.provider = await this.userRepository.findOne({where: {id: providerId}});

        offer.createdAt = new Date();
        offer.state = "open";

        const offerDb = await this.offerRepository.save(offer)

        for (let plzDto of offerDto.route) {
            //TODO: vorher prüfen ob plz bereits existiert, dann plz unique machen!
            const checkPlz = await this.checkIfPlzIsDuplicat(plzDto);

            if (!checkPlz) {
                const plz = new Plz();
                plz.offers = [];
                plz.offers.push(offerDb);
                plz.plz = plzDto.plz;
                await this.plzRepository.save(plz);
            } else {
                checkPlz.offers.push(offerDb);
                offerDb.route.push(checkPlz);
                await this.plzRepository.save(checkPlz);
                await this.offerRepository.save(offerDb);
            }

        }

    }

    async checkIfPlzIsDuplicat(plzDto: CreatePlzDto): Promise<Plz | null> {
        return await this.plzRepository.findOne({where: {plz: plzDto.plz}, relations: ["offers"]});
    }


    async getOffers(searchFor?: string) {
        if (searchFor) {
            return await this.offerRepository.find({where: {description: Like(`%${searchFor}%`),}, relations: ["provider", "route", "clients"]})
        }

        return await this.offerRepository.createQueryBuilder('offer')
            .leftJoinAndSelect('offer.provider', 'provider')
            .leftJoinAndSelect('offer.route', 'route')
            .leftJoinAndSelect('offer.clients', 'clients')
            .getMany();

    }

    async getOffersOfUser(userId: number) {
        return await this.offerRepository.createQueryBuilder('offer')
            .leftJoinAndSelect('offer.provider', 'provider')
            .leftJoinAndSelect('offer.route', 'route')
            .leftJoinAndSelect('offer.clients', 'clients')
            .where('offer.provider.id = :userId', {
                userId: userId
            })
            .getMany();
    }


}
