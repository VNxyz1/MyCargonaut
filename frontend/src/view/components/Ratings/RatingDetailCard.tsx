import { Card, Col, Row } from "react-bootstrap";
import { Rating } from "../../../interfaces/Rating";
import StarRating from "./StarRating";
import {
    CargoArrivedUndamagedRatingHeadline,
    ComfortDuringTripRatingHeadline,
    PassengerPleasantnessRatingHeadline, PunctualityRatingHeadline, ReliabilityRatingHeadline
} from "./RatingHeadlines";
import { TripRequest } from "../../../interfaces/TripRequest";
import React, { useEffect } from "react";
import { getTripRequestById } from "../../../services/tripRequestService";

function RatingDetailCard(props: {
    rating: Rating
}) {
    const [tripData, setTripData] = React.useState<TripRequest>();

    useEffect(() => {
        getTripRequestById(props.rating.tripId)
            .then((r) => {
                setTripData(r);
            })
    }, []);

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <div className="rating-txt">
                        {tripData ? tripData.startPlz.location : 'Start'} -{">"} {tripData ? tripData.endPlz.location : 'Ende'}
                        <span>{(props.rating.totalRating * 20).toFixed()}%</span>
                    </div>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{new Date(props.rating.tripDate).toLocaleDateString()}</Card.Subtitle>
                <Card.Text>
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