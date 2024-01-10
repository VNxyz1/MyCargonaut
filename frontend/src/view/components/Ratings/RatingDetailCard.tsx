import { Card, Col, Row } from "react-bootstrap";
import { Rating } from "../../../interfaces/Rating";
import StarRating from "./StarRating";

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
                    <Row>
                        <Col xs="auto">
                            <StarRating initialValue={props.rating.totalRating} disabled />
                        </Col>
                        <Col>
                            <span><i className="icon-user"/> Gesamt</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                            <StarRating initialValue={props.rating.punctuality} disabled />
                        </Col>
                        <Col>
                            <span><i className="icon-clock"/> Pünktlich</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                            <StarRating initialValue={props.rating.reliability} disabled />
                        </Col>
                        <Col>
                            <span><i className="icon-handshake"/> Zuverlässig</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                            <StarRating initialValue={props.rating.comfortDuringTrip} disabled />
                        </Col>
                        <Col>
                            <span><i className="icon-face-smile"/> Wohlsein</span>
                        </Col>
                    </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default RatingDetailCard;