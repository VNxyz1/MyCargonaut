import {UserLight} from "./UserLight.ts";
import {Plz} from "./Plz.ts";

export interface TripRequest {
    id: number;

    requester: UserLight;

    startPlz: Plz;

    endPlz: Plz;

    createdAt: Date;

    cargoImg: string | null;

    description: string;

    startDate: Date;

    seats: number;
}