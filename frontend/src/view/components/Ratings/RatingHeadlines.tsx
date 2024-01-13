import { RatingTypes } from "../../../interfaces/RatingTypes";

export function TotalRatingHeadline() {
    return (
        <span><i className="icon-user"></i> {RatingTypes.totalRating}</span>
    )
}
export function PunctualityRatingHeadline() {
    return (
        <span><i className="icon-clock"></i> {RatingTypes.punctuality}</span>
    )
}

export function ReliabilityRatingHeadline() {
    return (
        <span><i className="icon-handshake"></i> {RatingTypes.reliability}</span>
    )
}

export function ComfortDuringTripRatingHeadline() {
    return (
        <span><i className="icon-person-circle-check"></i> {RatingTypes.comfortDuringTrip}</span>
    )
}

export function CargoArrivedUndamagedRatingHeadline() {
    return (
        <span><i className="icon-boxes-packing"></i> {RatingTypes.cargoArrivedUndamaged}</span>
    )
}

export function PassengerPleasantnessRatingHeadline() {
    return (
        <span><i className="icon-face-smile"></i> {RatingTypes.passengerPleasantness}</span>
    )
}
