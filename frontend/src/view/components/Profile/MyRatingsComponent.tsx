import Container from 'react-bootstrap/Container';
import RatingDetailCard from '../Ratings/RatingDetailCard';
import React from 'react';
import { Rating } from '../../../interfaces/Rating';
import {Card, Col, Row } from 'react-bootstrap';
import AccumulatedRatingsCard from '../Ratings/AccumulatedRatingsCard';

const TEST_RATINGS_DRIVER: Rating[] = [
    {'raterId': 40,
        'rateeId': 30,
        'tripId': 75,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 5,
        'punctuality': 4,
        'reliability': 4,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 71,
        'rateeId': 94,
        'tripId': 17,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 3,
        'punctuality': 4,
        'reliability': 5,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 43,
        'rateeId': 94,
        'tripId': 37,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 1,
        'punctuality': 2,
        'reliability': 3,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 45,
        'rateeId': 52,
        'tripId': 74,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 5,
        'reliability': 2,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 93,
        'rateeId': 11,
        'tripId': 8,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 4,
        'punctuality': 1,
        'reliability': 2,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 3,
        'rateeId': 26,
        'tripId': 57,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 5,
        'punctuality': 4,
        'reliability': 3,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 67,
        'rateeId': 69,
        'tripId': 83,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 3,
        'punctuality': 2,
        'reliability': 4,
        'comfortDuringTrip': 0,
        'cargoArrivedUndamaged': 0,
        'passengerPleasantness': 0},
    {'raterId': 25,
        'rateeId': 15,
        'tripId': 92,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 5,
        'punctuality': 2,
        'reliability': 4,
        'comfortDuringTrip': 3,
        'cargoArrivedUndamaged': 4,
        'passengerPleasantness': 4},
    {'raterId': 65,
        'rateeId': 73,
        'tripId': 17,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 5,
        'reliability': 5,
        'comfortDuringTrip': 2,
        'cargoArrivedUndamaged': 1,
        'passengerPleasantness': 5},
    {'raterId': 8,
        'rateeId': 30,
        'tripId': 57,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 1,
        'reliability': 2,
        'comfortDuringTrip': 2,
        'cargoArrivedUndamaged': 5,
        'passengerPleasantness': 5},
    {'raterId': 22,
        'rateeId': 31,
        'tripId': 33,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 5,
        'punctuality': 1,
        'reliability': 5,
        'comfortDuringTrip': 4,
        'cargoArrivedUndamaged': 1,
        'passengerPleasantness': 1},
    {'raterId': 42,
        'rateeId': 74,
        'tripId': 66,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 4,
        'punctuality': 1,
        'reliability': 2,
        'comfortDuringTrip': 1,
        'cargoArrivedUndamaged': 2,
        'passengerPleasantness': 1},
    {'raterId': 58,
        'rateeId': 27,
        'tripId': 27,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 1,
        'punctuality': 4,
        'reliability': 3,
        'comfortDuringTrip': 4,
        'cargoArrivedUndamaged': 5,
        'passengerPleasantness': 2},
    {'raterId': 87,
        'rateeId': 8,
        'tripId': 67,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 5,
        'reliability': 1,
        'comfortDuringTrip': 3,
        'cargoArrivedUndamaged': 2,
        'passengerPleasantness': 2}
];
const TEST_RATINGS_PASSENGER: Rating[] = [
    {'raterId': 56,
        'rateeId': 68,
        'tripId': 52,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 1,
        'punctuality': 1,
        'reliability': 2,
        'comfortDuringTrip': 4,
        'cargoArrivedUndamaged': 1,
        'passengerPleasantness': 3},
    {'raterId': 86,
        'rateeId': 40,
        'tripId': 92,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 5,
        'punctuality': 1,
        'reliability': 2,
        'comfortDuringTrip': 2,
        'cargoArrivedUndamaged': 1,
        'passengerPleasantness': 1},
    {'raterId': 79,
        'rateeId': 31,
        'tripId': 94,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 3,
        'reliability': 2,
        'comfortDuringTrip': 3,
        'cargoArrivedUndamaged': 5,
        'passengerPleasantness': 4},
    {'raterId': 98,
        'rateeId': 36,
        'tripId': 2,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 5,
        'reliability': 5,
        'comfortDuringTrip': 3,
        'cargoArrivedUndamaged': 4,
        'passengerPleasantness': 4},
    {'raterId': 54,
        'rateeId': 85,
        'tripId': 16,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 4,
        'punctuality': 4,
        'reliability': 1,
        'comfortDuringTrip': 4,
        'cargoArrivedUndamaged': 2,
        'passengerPleasantness': 2},
    {'raterId': 44,
        'rateeId': 6,
        'tripId': 31,
        'tripDate': "2024-02-18T00:00:00.000Z",
        'totalRating': 2,
        'punctuality': 2,
        'reliability': 3,
        'comfortDuringTrip': 3,
        'cargoArrivedUndamaged': 1,
        'passengerPleasantness': 3}
];

function MyRatingsComponent() {
    const [ratingsDriver, setRatingsDriver] = React.useState<Rating[]>([]);
    const [ratingsPassenger, setRatingsPassenger] = React.useState<Rating[]>([]);

    React.useEffect(() => {
        setRatingsDriver(TEST_RATINGS_DRIVER);
        setRatingsPassenger(TEST_RATINGS_PASSENGER)
        // TODO: get ratings from API
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

