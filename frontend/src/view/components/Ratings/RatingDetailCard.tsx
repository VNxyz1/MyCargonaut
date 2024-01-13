import { Card, Col, Row } from "react-bootstrap";
import { Rating } from "../../../interfaces/Rating";
import StarRating from "./StarRating";
import {
    CargoArrivedUndamagedRatingHeadline,
    ComfortDuringTripRatingHeadline,
    PassengerPleasantnessRatingHeadline, PunctualityRatingHeadline, ReliabilityRatingHeadline, TotalRatingHeadline
} from "./RatingHeadlines";

function RatingDetailCard(props: {
    rating: Rating
}) {
    // TODO: get trip details to fill out card, maybe photo of car

    return (
        <Card>
            <Card.Body>
                <Card.Title>TripName</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">TripDatum</Card.Subtitle>
                <Card.Text>
                    {props.rating.totalRating > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.totalRating} disabled />
                            </Col>
                            <Col>
                                <TotalRatingHeadline/>
                            </Col>
                        </Row>
                    }
                    {props.rating.punctuality > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.punctuality} disabled />
                            </Col>
                            <Col>
                                <PunctualityRatingHeadline/>
                            </Col>
                        </Row>
                    }
                    {props.rating.reliability > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.reliability} disabled />
                            </Col>
                            <Col>
                                <ReliabilityRatingHeadline/>
                            </Col>
                        </Row>
                    }
                    {props.rating.comfortDuringTrip > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.comfortDuringTrip} disabled />
                            </Col>
                            <Col>
                                <ComfortDuringTripRatingHeadline/>
                            </Col>
                        </Row>
                    }
                    {props.rating.cargoArrivedUndamaged > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.cargoArrivedUndamaged} disabled />
                            </Col>
                            <Col>
                                <CargoArrivedUndamagedRatingHeadline/>
                            </Col>
                        </Row>
                    }
                    {props.rating.passengerPleasantness > 0 &&
                        <Row>
                            <Col xs="auto">
                                <StarRating initialValue={props.rating.passengerPleasantness} disabled />
                            </Col>
                            <Col>
                                <PassengerPleasantnessRatingHeadline/>
                            </Col>
                        </Row>
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default RatingDetailCard;