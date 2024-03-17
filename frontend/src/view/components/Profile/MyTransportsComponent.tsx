import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import { TripRequest } from '../../../interfaces/TripRequest.ts';
import { getOwnTripRequests } from '../../../services/tripRequestService.ts';
import { Row } from 'react-bootstrap';
import TripListItem from '../Search-Transport-Page/Trip-List-Item.tsx';


function MyTransportsComponent() {
  const [requests, setRequests] = useState<TripRequest[]>([]);

  useEffect(() => {
    renderRequests();
  }, []);

  const renderRequests = async () => {
    const tripRequests = await getOwnTripRequests();
    if (tripRequests) {
      setRequests(tripRequests);
    }
  };

  return (
    <Container>
      {requests.length !== 0 ?
        <></>
        : <h3>Du hast zurzeit keine Gesuche eingestellt</h3>
      }
      <Row>
        {requests.map((tR)=> (
          <TripListItem trip={tR}/>
        ))}
      </Row>
    </Container>
  );
}

export default MyTransportsComponent;

