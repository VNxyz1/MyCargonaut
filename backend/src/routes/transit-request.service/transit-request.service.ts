import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { ReservedCoin } from '../../database/ReservedCoin';
import { TransitRequest } from '../../database/TransitRequest';
import { PutTransitRequestRequestDto } from '../transit-request/DTOs/PutTransitRequestRequestDto';
import { PostTransitRequestRequestDto } from '../transit-request/DTOs/PostTransitRequestRequestDto';

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
    @InjectRepository(ReservedCoin)
    private readonly reservedCoinRepository: Repository<ReservedCoin>,
  ) {}

  async postTransitRequest(offer: Offer, requestingUser: User, request: PostTransitRequestRequestDto) {
    const transitRequestCheck = await this.findTransitRequestWithOfferAndRequester(requestingUser, offer);
    const clientCheck = await this.findOfferWithRequeserAsClient(requestingUser, offer);

    if (transitRequestCheck) {
      throw new BadRequestException('There already is a pending request!');
    }

    if (clientCheck) {
      throw new BadRequestException('You were already accepted as client!');
    }

    let transitRequest = this.transitRequestRepository.create();
    transitRequest.requester = requestingUser;
    transitRequest.offeredCoins = request.offeredCoins;
    transitRequest.requestedSeats = request.requestedSeats;
    transitRequest.text = request.text;
    transitRequest.offer = offer;
    transitRequest = await this.transitRequestRepository.save(transitRequest);
    offer.transitRequests.push(transitRequest);
    await this.offerRepository.save(offer);
  }

  async putTransitRequest(offer: Offer, requestingUser: User, updatedRequest: PutTransitRequestRequestDto) {
    let transitRequest = await this.findTransitRequestWithOfferAndRequester(requestingUser, offer);

    if (!transitRequest) {
      throw new NotFoundException('No matching request found');
    }

    if (updatedRequest.offeredCoins !== undefined) {
      transitRequest.offeredCoins = updatedRequest.offeredCoins;
    }

    if (updatedRequest.requestedSeats !== undefined) {
      transitRequest.requestedSeats = updatedRequest.requestedSeats;
    }

    if (updatedRequest.text !== undefined) {
      transitRequest.text = updatedRequest.text;
    }

    transitRequest = await this.transitRequestRepository.save(transitRequest);
    offer.transitRequests.push(transitRequest);
    await this.offerRepository.save(offer);
  }

  async getAllTransitRequestsOfUser(userId: number) {
    const transitRequests = await this.transitRequestRepository
      .createQueryBuilder('transitRequest')
      .leftJoinAndSelect('transitRequest.requester', 'requester')
      .leftJoinAndSelect('transitRequest.offer', 'offer')
      .leftJoinAndSelect('offer.provider', 'provider')
      .leftJoinAndSelect('offer.route', 'route')
      .leftJoinAndSelect('route.plz', 'plz')
      .leftJoinAndSelect('offer.clients', 'clients')
      .leftJoinAndSelect('offer.vehicle', 'vehicles')
      .where('transitRequest.requester.id = :userId', { userId })
      .getMany();
    if (!transitRequests) {
      throw new NotFoundException('No pending transit requests found');
    }
    return transitRequests;
  }

  async getAllRecivedTransitRequestsOfUser(userId: number) {
    const transitRequests = await this.transitRequestRepository.find({
      where: {
        offer: { provider: { id: userId } },
      },
      relations: ['requester', 'offer', 'offer.provider', 'offer.route', 'offer.route.plz'],
    });
    if (!transitRequests) {
      throw new NotFoundException('No pending transit requests found');
    }
    return transitRequests;
  }

  async getTransitRequestById(id: number) {
    const tR = await this.transitRequestRepository.findOne({
      where: { id },
      relations: ['offer', 'requester', 'offer.provider'],
    });

    if (!tR) {
      throw new NotFoundException('No pending transit requests found');
    }

    return tR;
  }

  async acceptTransitRequest(tR: TransitRequest) {
    const offer = await this.offerRepository.findOne({
      where: { id: tR.offer.id },
      relations: ['transitRequests'],
    });
    const client = await this.userRepository.findOne({
      where: { id: tR.requester.id },
      relations: ['requestedTransits'],
    });

    offer.clients.push(client);
    offer.transitRequests = offer.transitRequests.filter((tranReq) => tranReq.id !== tR.id);
    offer.bookedSeats += tR.requestedSeats;

    //Insert reserved coins
    const reservedCoin = this.reservedCoinRepository.create();
    reservedCoin.amount = tR.offeredCoins;
    reservedCoin.user = client;
    reservedCoin.trip = offer;
    await this.reservedCoinRepository.save(reservedCoin);

    await this.offerRepository.save(offer);

    client.requestedTransits = client.requestedTransits.filter((rT) => rT.id !== tR.id);

    await this.userRepository.save(client);

    await this.transitRequestRepository.delete(tR.id);
  }

  async delete(tR: TransitRequest) {
    const offer = await this.offerRepository.findOne({
      where: { id: tR.offer.id },
      relations: ['transitRequests'],
    });
    const client = await this.userRepository.findOne({
      where: { id: tR.requester.id },
      relations: ['requestedTransits'],
    });

    offer.transitRequests = offer.transitRequests.filter((tranReq) => tranReq.id !== tR.id);
    await this.offerRepository.save(offer);

    client.requestedTransits = client.requestedTransits.filter((rT) => rT.id !== tR.id);
    await this.userRepository.save(client);

    await this.transitRequestRepository.delete(tR.id);
  }

  private async findTransitRequestWithOfferAndRequester(requestingUser: User, offer: Offer) {
    return await this.transitRequestRepository
      .createQueryBuilder('transitRequest')
      .leftJoinAndSelect('transitRequest.requester', 'requester')
      .leftJoinAndSelect('transitRequest.offer', 'offer')
      .where('transitRequest.requester.id = :userId AND transitRequest.offer.id = :offerId', {
        userId: requestingUser.id,
        offerId: offer.id,
      })
      .getOne();
  }

  private async findOfferWithRequeserAsClient(requestingUser: User, offer: Offer) {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.clients', 'clients')
      .where('clients.id = :userId AND offer.id = :offerId', {
        userId: requestingUser.id,
        offerId: offer.id,
      })
      .getOne();
  }
}
