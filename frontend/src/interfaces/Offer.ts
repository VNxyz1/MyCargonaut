import {RoutePart} from "./RoutePart.ts";
import {TransitRequest} from "./TransitRequest.ts";
import {UserLight} from "./UserLight.ts";

export interface Offer {
    id: number;

    provider: UserLight;

    route: RoutePart[];

    createdAt: Date;

    clients: UserLight[];

    vehicle: string;

    bookedSeats: number;

    state: number;

    description: string;

    startDate: Date;

    transitRequests: TransitRequest[] | undefined;
}
