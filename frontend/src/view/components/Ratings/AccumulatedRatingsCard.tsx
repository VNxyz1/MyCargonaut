import { Card, ProgressBar, Row } from "react-bootstrap";
import { Rating } from "../../../interfaces/Rating";
import { AverageRatings } from "../../../interfaces/AverageRatings";
import { RatingTypes } from "../../../interfaces/RatingTypes";

function AccumulatedRatingsCard(props: {
    ratings: Rating[]
    driver: boolean
}) {
    function calculateAverageRatings(ratings: Rating[]): AverageRatings {
        const total = ratings.reduce((acc, rating) => {
            acc.totalRating += rating.totalRating;
            acc.punctuality += rating.punctuality;
            acc.reliability += rating.reliability;
            acc.comfortDuringTrip += rating.comfortDuringTrip;
            acc.cargoArrivedUndamaged += rating.cargoArrivedUndamaged;
            acc.passengerPleasantness += rating.passengerPleasantness;
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
            averageTotalRating: total.totalRating / count * 20,
            averagePunctuality: total.punctuality / count * 20,
            averageReliability: total.reliability / count * 20,
            averageComfortDuringTrip: total.comfortDuringTrip / count * 20,
            averageCargoArrivedUndamaged: total.cargoArrivedUndamaged / count * 20,
            averagePassengerPleasantness: total.passengerPleasantness / count * 20
        };
    }

    const averageRatings = calculateAverageRatings(props.ratings);

    return (
        <Card>
            <Card.Body>
                <Card.Title>Bewertung</Card.Title>
                <Card.Subtitle>als {props.driver ? 'Fahrer' : 'Mitfahrer'} aus {props.ratings.length} abgegebenen Bewertungen</Card.Subtitle>
                <Card.Text>
                    <Row>
                        <div className="rating-wrapper">
                            <div className="rating-txt">
                                <span><i className="icon-user"></i> {RatingTypes.totalRating}</span>
                                <span>{averageRatings.averageTotalRating.toFixed(0)}%</span>
                            </div>
                            <ProgressBar now={averageRatings.averageTotalRating}/>
                        </div>
                    </Row>
                    <Row>
                        <div className="rating-wrapper">
                            <div className="rating-txt">
                                <span><i className="icon-clock"></i> {RatingTypes.punctuality}</span>
                                <span>{averageRatings.averagePunctuality.toFixed(0)}%</span>
                            </div>
                            <ProgressBar now={averageRatings.averagePunctuality}/>
                        </div>
                    </Row>
                    <Row>
                        <div className="rating-wrapper">
                            <div className="rating-txt">
                                <span><i className="icon-handshake"></i> {RatingTypes.reliability}</span>
                                <span>{averageRatings.averageReliability.toFixed(0)}%</span>
                            </div>
                            <ProgressBar now={averageRatings.averageReliability}/>
                        </div>
                    </Row>
                    {!props.driver &&
                        <Row>
                            <div className="rating-wrapper">
                                <div className="rating-txt">
                                    <span><i className="icon-face-smile"></i> {RatingTypes.comfortDuringTrip}</span>
                                    <span>{averageRatings.averageComfortDuringTrip.toFixed(0)}%</span>
                                </div>
                                <ProgressBar now={averageRatings.averageComfortDuringTrip}/>
                            </div>
                        </Row>
                    }
                    {!props.driver &&
                        <Row>
                            <div className="rating-wrapper">
                                <div className="rating-txt">
                                    <span><i className="icon-user"></i> {RatingTypes.cargoArrivedUndamaged}</span>
                                    <span>{averageRatings.averageCargoArrivedUndamaged.toFixed(0)}%</span>
                                </div>
                                <ProgressBar now={averageRatings.averageCargoArrivedUndamaged}/>
                            </div>
                        </Row>
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default AccumulatedRatingsCard