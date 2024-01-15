import {AverageRatings} from "../../../interfaces/Rating.ts";
import {
    CargoArrivedUndamagedRatingHeadline,
    ComfortDuringTripRatingHeadline, PassengerPleasantnessRatingHeadline,
    PunctualityRatingHeadline,
    ReliabilityRatingHeadline,
    TotalRatingHeadline
} from "./RatingHeadlines.tsx";
import ProgressBar from "react-bootstrap/ProgressBar";

function AverageRatingsComponent (
    props: {
        averageRatings: AverageRatings
    }) {

    const percentRatings: AverageRatings = {
        amount: props.averageRatings.amount,
        cargoArrivedUndamaged: props.averageRatings.cargoArrivedUndamaged * 20,
        comfortDuringTrip: props.averageRatings.comfortDuringTrip * 20,
        passengerPleasantness: props.averageRatings.passengerPleasantness * 20,
        punctuality: props.averageRatings.punctuality * 20,
        reliability: props.averageRatings.reliability * 20,
        totalRating: props.averageRatings.totalRating * 20
    }

    return (
        <><p>{percentRatings.amount} Bewertungen</p>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <TotalRatingHeadline/>
                    <span>{percentRatings.totalRating > 0 ? percentRatings.totalRating.toFixed() : 0}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.totalRating}/>
            </div>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <PunctualityRatingHeadline/>
                    <span>{percentRatings.punctuality.toFixed()}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.punctuality}/>
            </div>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <ReliabilityRatingHeadline/>
                    <span>{percentRatings.reliability.toFixed()}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.reliability}/>
            </div>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <ComfortDuringTripRatingHeadline/>
                    <span>{percentRatings.comfortDuringTrip.toFixed()}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.comfortDuringTrip}/>
            </div>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <CargoArrivedUndamagedRatingHeadline/>
                    <span>{percentRatings.cargoArrivedUndamaged.toFixed()}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.cargoArrivedUndamaged}/>
            </div>
            <div className="rating-wrapper">
                <div className="rating-txt">
                    <PassengerPleasantnessRatingHeadline/>
                    <span>{percentRatings.passengerPleasantness.toFixed()}%</span>
                </div>
                <ProgressBar
                    now={percentRatings.passengerPleasantness}/>
            </div>
        </>
    )
}

export default AverageRatingsComponent