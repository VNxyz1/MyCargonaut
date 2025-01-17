import {RoutePart} from "./RoutePart.ts";
import {TransitRequest} from "./TransitRequest.ts";
import {UserLight} from "./UserLight.ts";
import {Vehicle} from "./Vehicle.ts";

export interface Offer {
    id: number;

    provider: UserLight;

    route: RoutePart[];

    createdAt: Date;

    clients: UserLight[];

    vehicle: Vehicle;

    bookedSeats: number;

    state: number;

    description: string;

    startDate: Date;

    transitRequests: TransitRequest[] | undefined;
}

export interface OfferList{
    offerList: Offer[];
}

export enum TripState {
    request,
    offer,
    bookedUp,
    inTransit,
    finished,
}