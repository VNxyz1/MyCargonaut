import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import { Offer, TripState } from '../../../interfaces/Offer.ts';
import { getOwnOffers, getPassengerOffers } from '../../../services/offerService.tsx';
import { Row } from 'react-bootstrap';
import TripListItem from '../Search-Transport-Page/Trip-List-Item.tsx';


function MyTripsComponent() {
    const [plannedOffersAsDriver, setPlannedOffersAsDriver] = useState<Offer[]>([]);
    const [plannedOffersAsPassenger, setPlannedOffersAsPassenger] = useState<Offer[]>([]);



    useEffect(() => {
        renderOffersAsDriver();
        renderOffersAsPassenger();
    }, []);

    const renderOffersAsDriver = async () => {
        const offers = await getOwnOffers();
        if (offers) {
            const { planned } = splitIntoPlannedAndFinished(offers);
            setPlannedOffersAsDriver(planned);
        }
    }

    const renderOffersAsPassenger = async () => {
        const offers = await getPassengerOffers();
        if (offers) {
            const { planned} = splitIntoPlannedAndFinished(offers);
            setPlannedOffersAsPassenger(planned);
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
            {plannedOffersAsDriver.length == 0 && plannedOffersAsPassenger.length == 0 ?
              <h3>Du hast keine Fahrten geplant</h3>
              : <></>
            }
            {plannedOffersAsDriver.length !== 0 ?
              <h3>Du Fährst:</h3>
              : <></>
            }
            <Row>
                {plannedOffersAsDriver.map((offer)=> (
                      <TripListItem trip={offer}/>
                ))}
            </Row>

            {plannedOffersAsPassenger.length !== 0 ?
              <h3>Du Fährst mit:</h3>
              : <></>
            }
            <Row>
                {plannedOffersAsPassenger.map((offer)=> (
                      <TripListItem trip={offer}/>
                ))}
            </Row>




        </Container>

    );
}

export default MyTripsComponent;

