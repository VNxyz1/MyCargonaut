import { Offer } from '../../database/Offer';
import { GetOfferResponseDto } from '../offer/DTOs/GetOfferResponseDto';
import { User } from '../../database/User';
import { GetOtherUserDto } from '../offer/DTOs/GetOtherUserDto';
import { convertVehicleToCreateVehicleDto } from './convertToCreateVehicleDto';
import { TripRequest } from '../../database/TripRequest';
import { GetTripRequestResponseDto } from '../request/DTOs/GetTripRequestResponseDto';
import { calcAge } from './calcAge';

export const convertOfferToGetOfferDto = (offer: Offer) => {
  const getOfferResponseDto: GetOfferResponseDto = new GetOfferResponseDto();
  getOfferResponseDto.id = offer.id;
  getOfferResponseDto.provider = convertUserToOtherUser(offer.provider);
  getOfferResponseDto.createdAt = new Date(offer.createdAt);
  getOfferResponseDto.clients = offer.clients.map((client) =>
    convertUserToOtherUser(client),
  );
  getOfferResponseDto.vehicle = convertVehicleToCreateVehicleDto(offer.vehicle);
  getOfferResponseDto.bookedSeats = offer.bookedSeats;
  getOfferResponseDto.state = offer.state;
  getOfferResponseDto.description = offer.description;
  getOfferResponseDto.startDate = offer.startDate;
  getOfferResponseDto.transitRequests = offer.transitRequests;
  getOfferResponseDto.route = offer.route;

  return getOfferResponseDto;
};

export const convertUserToOtherUser = (user: User) => {
  const otherUserDto: GetOtherUserDto = new GetOtherUserDto();
  otherUserDto.id = user.id;
  otherUserDto.firstName = user.firstName;
  otherUserDto.lastName = user.lastName;
  otherUserDto.profilePicture = user.profilePicture;
  otherUserDto.entryDate = new Date(user.entryDate);
  otherUserDto.age = calcAge(new Date(user.birthday));
  otherUserDto.phoneNumberProvided = !!user.phoneNumber;
  if (user.offers) {
    otherUserDto.offers = user.offers.map((o) => convertOfferToGetOfferDto(o));
  }
  if (user.requestedTrips) {
    otherUserDto.tripRequests = user.requestedTrips.map((tR) =>
      convertTripRequestToGetDto(tR),
    );
  }

  return otherUserDto;
};

export const convertTripRequestToGetDto = (tripRequest: TripRequest) => {
  const dto = new GetTripRequestResponseDto();
  dto.id = tripRequest.id;
  dto.requester = convertUserToOtherUser(tripRequest.requester);
  dto.startPlz = tripRequest.startPlz;
  dto.endPlz = tripRequest.endPlz;
  dto.createdAt = new Date(tripRequest.createdAt);
  dto.description = tripRequest.description;
  dto.cargoImg = tripRequest.cargoImg;
  dto.startDate = tripRequest.startDate;
  dto.seats = tripRequest.seats;

  return dto;
};
