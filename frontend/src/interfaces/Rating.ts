export interface DriverRating {
    "raterId": number,
    "rateeId": number,
    "tripId": number,
    "tripDate": string,
    "totalRating": number,
    "punctuality": number,
    "reliability": number,
    "cargoArrivedUndamaged": number,
    "passengerPleasantness": number
}

export interface JustDriverRating {
    "rateeId": number,
    "punctuality": number,
    "reliability": number,
    "cargoArrivedUndamaged": number,
    "passengerPleasantness": number
}

export interface PassengerRating {
    "raterId": number,
    "rateeId": number,
    "tripId": number,
    "tripDate": string,
    "totalRating": number,
    "punctuality": number,
    "reliability": number,
    "comfortDuringTrip": number,
}

export interface JustPassengerRating {
    "rateeId": number,
    "punctuality": number,
    "reliability": number,
    "comfortDuringTrip": number,
}

export interface GetUserRatings {
    "ratingsAsDriver": DriverRating[],
    "ratingsAsPassenger": PassengerRating[]
}

export interface Ratees{
    "rateeId": number,
    "rated": boolean
}

export interface GetRatedUser {
    "ratees": Ratees[]
}

export enum RatingTypes {
    "totalRating" = "Gesamt",
    "punctuality" = "Pünktlich",
    "reliability" = "Zuverlässig",
    "comfortDuringTrip" = "Angenehmer Beifahrer",
    "cargoArrivedUndamaged" = "Cargo intakt angekommen",
    "passengerPleasantness" = "Mitfahrer fühlen sich wohl"
}

export interface AverageRatings {
    amount: number;
    total: number;
    punctuality: number;
    reliability: number;
    comfortDuringTrip: number;
    cargoArrivedUndamaged: number;
    passengerPleasantness: number;
}