import ListGroup from 'react-bootstrap/ListGroup';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { TripRequestOffering } from '../../../interfaces/TripRequestOffering.ts';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import OfferingListItem from './OfferingListItem.tsx';
import TransitRequestListItem from './TransitRequestListItem.tsx';
import { TransitRequest } from '../../../interfaces/TransitRequest.ts';

function IOR_Sidebar() {

  const { incomingTransitRequests, incomingOfferings } = reqAndOffStore();
  const [selectedTRO, setSelectedTRO] = useState<TripRequestOffering | undefined>(undefined);
  const [selectedTR, setSelectedTR] = useState<TransitRequest | undefined>(undefined);

  const selectTRO = (tro: TripRequestOffering | undefined) => {
    setSelectedTRO(tro);
  };
  const selectTR = (tr: TransitRequest | undefined) => {
    setSelectedTR(tr);
  };

  const handleCloseModal = () => {
    setSelectedTRO(undefined);
    setSelectedTR(undefined);
  };

  return (
    <>
      <h3>Möchte mit Fahren:</h3>
      <ListGroup className="mb4" style={{ minWidth: '100%', overflow: 'auto' }}>
        {incomingOfferings.map((tro) => (
          <ListGroup.Item className="d-flex justify-content-between" style={{ minWidth: '100%', cursor: 'pointer' }}
                          onClick={() => selectTRO(tro)}>
            <span><strong>{tro.offeringUser.firstName} {tro.offeringUser.lastName}</strong></span>
            <span>{tro.requestedCoins} Coins</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h3>Möchte dich mit nehmen:</h3>
      <ListGroup className="mb4" style={{ minWidth: '100%', overflow: 'auto' }}>
        {incomingTransitRequests.map((tr) => (
          <ListGroup.Item className="d-flex justify-content-between" style={{ minWidth: '100%', cursor: 'pointer' }}
                          onClick={() => selectTR(tr)}>
            <span><strong>{tr.requester?.firstName} {tr.requester?.lastName}</strong></span>
            <span>{tr.offeredCoins} Coins</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal centered show={!!selectedTRO} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedTRO ?
            <OfferingListItem receiver offering={selectedTRO} />
            : <></>
          }
        </Modal.Body>
      </Modal>

      <Modal centered show={!!selectedTR} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedTR ?
            <TransitRequestListItem receiver transitRequest={selectedTR} />
            : <></>
          }
        </Modal.Body>
      </Modal>
    </>

  );
}

export default IOR_Sidebar;