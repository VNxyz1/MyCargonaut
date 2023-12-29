import {Offer} from "../../database/Offer";
import {GetOfferResponseDto} from "../offer/DTOs/GetOfferResponseDto";
import {User} from "../../database/User";
import {GetOtherUserDto} from "../offer/DTOs/GetOtherUserDto";

export const convertOfferToGetOfferDto = (offer: Offer) => {
    const getOfferResponseDto: GetOfferResponseDto = new GetOfferResponseDto();
    getOfferResponseDto.id = offer.id;
    getOfferResponseDto.provider = convertUserToOtherUser(offer.provider);
    getOfferResponseDto.createdAt = offer.createdAt;
    getOfferResponseDto.clients = offer.clients.map(client => convertUserToOtherUser(client));
    getOfferResponseDto.vehicle = offer.vehicle;
    getOfferResponseDto.bookedSeats = offer.bookedSeats;
    getOfferResponseDto.state = offer.state;
    getOfferResponseDto.description = offer.description;
    getOfferResponseDto.startDate = offer.startDate;
    getOfferResponseDto.transitRequests = offer.transitRequests;

    return getOfferResponseDto;
}

export const convertUserToOtherUser = (user: User) => {
    const otherUserDto: GetOtherUserDto = new GetOtherUserDto();
    otherUserDto.id = user.id;
    otherUserDto.firstName = user.firstName;
    otherUserDto.lastName = user.lastName;
    otherUserDto.profilePicture = user.profilePicture;

    return otherUserDto;
}