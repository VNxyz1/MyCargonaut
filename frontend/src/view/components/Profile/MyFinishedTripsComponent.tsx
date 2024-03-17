import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import { Offer, TripState } from '../../../interfaces/Offer.ts';
import { getOwnOffers, getPassengerOffers } from '../../../services/offerService.tsx';
import { Row } from 'react-bootstrap';
import TripListItem from '../Search-Transport-Page/Trip-List-Item.tsx';


function MyFinishedTripsComponent() {
    const [finishedOffersAsDriver, setFinishedOffersAsDriver] = useState<Offer[]>([]);
    const [finishedOffersAsPassenger, setFinishedOffersAsPassenger] = useState<Offer[]>([]);


    useEffect(() => {
        renderOffersAsDriver();
        renderOffersAsPassenger();
    }, []);

    const renderOffersAsDriver = async () => {
        const offers = await getOwnOffers();
        if (offers) {
            const { finished } = splitIntoPlannedAndFinished(offers);
            setFinishedOffersAsDriver(finished);
        }
    }

    const renderOffersAsPassenger = async () => {
        const offers = await getPassengerOffers();
        if (offers) {
            const {finished} = splitIntoPlannedAndFinished(offers);
            setFinishedOffersAsPassenger(finished);
        }
    }

    const splitIntoPlannedAndFinished = (offers: Offer[]) => {
        const finished: Offer[] = [];
        const planned: Offer[] = [];

        for (const offer of offers) {
            if (offer.state == TripState.finished) {
                finished.push(offer)
            } else {
                planned.push(offer)
            }
        }
        return {finished, planned}
    }


    return (

        <Container>
            {finishedOffersAsDriver.length == 0 && finishedOffersAsPassenger.length == 0 ?
              <h3>Du hast keine Fahrten beendet</h3>
              : <></>
            }
            {finishedOffersAsDriver.length !== 0 ?
              <h3>Du bist gefahren:</h3>
              : <></>
            }
            <Row>
                {finishedOffersAsDriver.map((offer)=> (
                      <TripListItem trip={offer}/>
                ))}
            </Row>

            {finishedOffersAsPassenger.length !== 0 ?
              <h3>Du bist mit gefahren:</h3>
              : <></>
            }
            <Row>
                {finishedOffersAsPassenger.map((offer)=> (
                      <TripListItem trip={offer}/>
                ))}
            </Row>




        </Container>

    );
}

export default MyFinishedTripsComponent;

