import Container from 'react-bootstrap/Container';
import RatingDetailCard from '../Ratings/RatingDetailCard';
import React from 'react';
import {Card, Col, Row } from 'react-bootstrap';
import AccumulatedRatingsCard from '../Ratings/AccumulatedRatingsCard';
import { getRatingsById } from '../../../services/ratingService';
import {DriverRating, PassengerRating} from "../../../interfaces/Rating";

function MyRatingsComponent ( props: {
    userId: number
}) {
    const [ratingsDriver, setRatingsDriver] = React.useState<DriverRating[]>([]);
    const [ratingsPassenger, setRatingsPassenger] = React.useState<PassengerRating[]>([]);

    React.useEffect(() => {
        getRatingsById(props.userId)
            .then((r) => {
                if (r) {
                    setRatingsDriver(r.ratingsAsDriver);
                    setRatingsPassenger(r.ratingsAsPassenger)
                }
            })
    }, []);

    return (
        <Container id={'prof-ratings'}>
            <Row className={'rating-columns'}>
                <Col>
                    {ratingsDriver.length === 0 ?
                        <Row className={'rating-rows'}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Du hast noch keine Bewertungen als Fahrer.
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Row>
                        :
                        <Row className={'rating-rows'}>
                            <AccumulatedRatingsCard ratings={ratingsDriver} driver={true}/>
                        </Row>
                    }
                    {ratingsDriver.map((rating) => {
                        return (
                            <Row className={'rating-rows'}>
                                <RatingDetailCard rating={rating}/>
                            </Row>
                        )
                    })}
                </Col>
                <Col>
                    {ratingsPassenger.length === 0 ?
                        <Row className={'rating-rows'}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Du hast noch keine Bewertungen als Mitfahrer.
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Row>
                        :
                        <Row className={'rating-rows'}>
                            <AccumulatedRatingsCard ratings={ratingsPassenger} driver={false}/>
                        </Row>
                    }
                    {ratingsPassenger.map((rating) => {
                        return (
                            <Row className={'rating-rows'}>
                                <RatingDetailCard rating={rating}/>
                            </Row>
                        )
                    })}
                </Col>
            </Row>
        </Container>
);
}

export default MyRatingsComponent;

