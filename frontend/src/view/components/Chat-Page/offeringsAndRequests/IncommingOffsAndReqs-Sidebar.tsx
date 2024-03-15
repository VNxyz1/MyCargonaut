import ListGroup from 'react-bootstrap/ListGroup';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { TripRequestOffering } from '../../../../interfaces/TripRequestOffering.ts';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import OfferingListItem from './OfferingListItem.tsx';
import TransitRequestListItem from './TransitRequestListItem.tsx';
import { TransitRequest } from '../../../../interfaces/TransitRequest.ts';
import Button from 'react-bootstrap/Button';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TransformToOfferModal from './TransformToOffer-Modal.tsx';

function IOR_Sidebar() {

  const { incomingTransitRequests, incomingOfferings, sentOfferings } = reqAndOffStore();
  const [selectedTRO, setSelectedTRO] = useState<TripRequestOffering | undefined>(undefined);
  const [selectedTR, setSelectedTR] = useState<TransitRequest | undefined>(undefined);
  const [transformModalContent, setTransFrormModalContent] = useState<TripRequestOffering | undefined>(undefined);

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

  const handleCloseTransformModal = () => {
    setTransFrormModalContent(undefined);
  }


  return (
    <>
      {incomingOfferings.length !== 0 ?
        <h3>Möchte dich mit nehmen:</h3>
        : <></>
      }
      <ListGroup className="mb3" style={{ minWidth: '100%', overflow: 'auto' }}>
        {incomingOfferings.map((tro) => (
          <ListGroup.Item className="d-flex justify-content-between align-items-center" style={{ minWidth: '100%', cursor: 'pointer' }}
                          onClick={() => selectTRO(tro)}>
            <span><strong>{tro.offeringUser.firstName} {tro.offeringUser.lastName}</strong></span>
            <span>{tro.requestedCoins} Coins</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {sentOfferings.length !== 0 ?
        <h3>Aktion erforderlich:</h3>
        : <></>
      }
      <ListGroup className="mb3" style={{ minWidth: '100%', overflow: 'auto' }}>
        {sentOfferings.map((tro) => (
          <>
            {tro.accepted ?
              <>
                <ListGroup.Item className="d-flex justify-content-between align-items-center"
                                style={{ minWidth: '100%', cursor: 'pointer' }}>
                  <span className='fw-bold'>{tro.tripRequest.requester.firstName} {tro.tripRequest.requester.lastName}</span>
                  <Button onClick={() => {setTransFrormModalContent(tro)}} className="mainButton w-auto px-3 py-1"><FontAwesomeIcon icon={faInfo} /></Button>
                </ListGroup.Item>
              </>
              :
              <></>
            }
          </>
        ))}
      </ListGroup>

      {incomingTransitRequests.length !== 0 ?
        <h3>Möchte mit Fahren:</h3>
        : <></>
      }
      <ListGroup className="mb3" style={{ minWidth: '100%', overflow: 'auto' }}>
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
            <OfferingListItem receiver offering={selectedTRO} closeModal={handleCloseModal} />
            : <></>
          }
        </Modal.Body>
      </Modal>

      <Modal centered show={!!selectedTR} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedTR ?
            <TransitRequestListItem receiver transitRequest={selectedTR} closeModal={handleCloseModal} />
            : <></>
          }
        </Modal.Body>
      </Modal>

      {transformModalContent ?
        <TransformToOfferModal show={!!transformModalContent} onClose={handleCloseTransformModal} tro={transformModalContent}/>
        :
        <></>
      }

    </>

  );
}

export default IOR_Sidebar;