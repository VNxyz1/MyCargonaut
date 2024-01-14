import { AverageRatings, GetUserRatings } from "./Rating.ts";
import { Offer } from "./Offer.ts";
import { TripRequest } from "./TripRequest.ts";

export interface UserLight {
    id: number;

    firstName: string;

    lastName: string;

    profilePicture: string;

    description: string;

    entryDate: Date;

    age: number;

    phoneNumberProvided: boolean;

    averageRatings: AverageRatings;

    totalRatings: GetUserRatings;

    offers: Offer[];

    tripRequests: TripRequest[];
}
