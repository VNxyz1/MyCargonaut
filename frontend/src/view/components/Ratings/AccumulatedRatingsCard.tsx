import { Card, ProgressBar, Row } from "react-bootstrap";
import {
    CargoArrivedUndamagedRatingHeadline,
    ComfortDuringTripRatingHeadline, PassengerPleasantnessRatingHeadline,
    PunctualityRatingHeadline,
    ReliabilityRatingHeadline,
} from "./RatingHeadlines";
import {AverageRatings, DriverRating, PassengerRating } from "../../../interfaces/Rating";

function AccumulatedRatingsCard(props: {
    ratings: DriverRating[] | PassengerRating[]
    driver: boolean
}) {
    function calculateAverageRatings(ratings: DriverRating[] | PassengerRating[]): AverageRatings {
        const total = ratings.reduce((acc, rating) => {
            acc.totalRating += rating.totalRating;
            acc.punctuality += rating.punctuality;
            acc.reliability += rating.reliability;
            acc.comfortDuringTrip += "comfortDuringTrip" in rating ? rating.comfortDuringTrip : 0;
            acc.cargoArrivedUndamaged += "cargoArrivedUndamaged" in rating ? rating.cargoArrivedUndamaged : 0;
            acc.passengerPleasantness += "passengerPleasantness" in rating ? rating.passengerPleasantness : 0;
            return acc;
        }, {
            totalRating: 0,
            punctuality: 0,
            reliability: 0,
            comfortDuringTrip: 0,
            cargoArrivedUndamaged: 0,
            passengerPleasantness: 0
        });

        const count = ratings.length;
        return {
            amount: count,
            total: total.totalRating / count * 20,
            punctuality: total.punctuality / count * 20,
            reliability: total.reliability / count * 20,
            comfortDuringTrip: total.comfortDuringTrip / count * 20,
            cargoArrivedUndamaged: total.cargoArrivedUndamaged / count * 20,
            passengerPleasantness: total.passengerPleasantness / count * 20
        };
    }

    const averageRatings = calculateAverageRatings(props.ratings);

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <div className="rating-txt">
                        {props.driver ? 'Fahrer' : 'Mitfahrer'} Bewertung
                        <span>{averageRatings.total.toFixed(0)}%</span>
                    </div>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">aus {averageRatings.amount} abgegebenen Bewertungen</Card.Subtitle>
                <Card.Text>
                    <Row>
                        <div className="rating-wrapper">
                            <div className="rating-txt">
                                <PunctualityRatingHeadline/>
                                <span>{averageRatings.punctuality.toFixed(0)}%</span>
                            </div>
                            <ProgressBar now={averageRatings.punctuality}/>
                        </div>
                    </Row>
                    <Row>
                        <div className="rating-wrapper">
                            <div className="rating-txt">
                                <ReliabilityRatingHeadline/>
                                <span>{averageRatings.reliability.toFixed(0)}%</span>
                            </div>
                            <ProgressBar now={averageRatings.reliability}/>
                        </div>
                    </Row>
                    {!props.driver &&
                        <Row>
                            <div className="rating-wrapper">
                                <div className="rating-txt">
                                    <ComfortDuringTripRatingHeadline/>
                                    <span>{averageRatings.comfortDuringTrip.toFixed(0)}%</span>
                                </div>
                                <ProgressBar now={averageRatings.comfortDuringTrip}/>
                            </div>
                        </Row>
                    }
                    {props.driver &&
                        <Row>
                            <div className="rating-wrapper">
                                <div className="rating-txt">
                                    <CargoArrivedUndamagedRatingHeadline/>
                                    <span>{averageRatings.cargoArrivedUndamaged.toFixed(0)}%</span>
                                </div>
                                <ProgressBar now={averageRatings.cargoArrivedUndamaged}/>
                            </div>
                        </Row>
                    }
                    {props.driver &&
                        <Row>
                            <div className="rating-wrapper">
                                <div className="rating-txt">
                                    <PassengerPleasantnessRatingHeadline/>
                                    <span>{averageRatings.passengerPleasantness.toFixed(0)}%</span>
                                </div>
                                <ProgressBar now={averageRatings.passengerPleasantness}/>
                            </div>
                        </Row>
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default AccumulatedRatingsCard