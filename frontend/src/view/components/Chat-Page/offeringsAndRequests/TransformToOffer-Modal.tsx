import { Col, Modal, ModalProps, Row } from 'react-bootstrap';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { TripRequestOffering } from '../../../../interfaces/TripRequestOffering.ts';
import {
  CreateRoutePart, getOfferingsAsRequestingUser,
  notTransformRequest,
  PostTransformToOfferDto, transformRequest,
} from '../../../../services/tripRequestService.ts';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { Vehicle } from '../../../../interfaces/Vehicle.ts';
import { getOwnVehicles } from '../../../../services/vehicleService.tsx';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';

interface Props extends ModalProps {
  onClose: () => void,
  tro: TripRequestOffering
}


interface RouteInList {
  id: string;
  plz: string;
  location: string;
  position: number;
}


const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties => ({
  userSelect: 'none',

  background: isDragging ? '' : '',

  ...draggableStyle,
});

const alignCenter: CSSProperties = {
  display: 'flex',
  textAlign: 'start',
  alignItems: 'center',
  paddingTop: '2px',
  paddingBottom: '2px',
};


function TransformToOfferModal(props: Props) {
  const { setSentOfferings } = reqAndOffStore();
  const [plzValue, setPlzValue] = useState<string>('');
  const [locationValue, setLocationValue] = useState<string>('');
  const [routes, setRoutes] = useState<RouteInList[]>([]);
  const plzInputEl = useRef<HTMLElement | null>(null);
  const listElement = useRef<HTMLElement | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleSeats, setVehicleSeats] = useState<number>(-1);
  const [feedback, setFeedback] = useState<string | undefined>(undefined);
  const [dateTimeDisplay, setDateTimeDisplay] = useState('');


  const [accepted, setAccepted] = useState<boolean>(false);
  const [postOfferBody, setPostBodyOffer] = useState<PostTransformToOfferDto>({
    additionalSeats: 0,
    description: '',
    route: undefined,
    startDate: '',
    vehicleId: 0,
  });


  useEffect(() => {
    if (props.tro !== undefined) {
      const start: RouteInList = {
        id: 'id_' + 0,
        plz: props.tro.tripRequest.startPlz.plz,
        location: props.tro.tripRequest.startPlz.location,
        position: 1,
      };
      const end: RouteInList = {
        id: 'id_' + 1,
        plz: props.tro.tripRequest.endPlz.plz,
        location: props.tro.tripRequest.endPlz.location,
        position: 2,
      };
      setRoutes([start, end]);
      fetchVehicle();
      setFeedback(undefined);
      setDateTimeDisplay(convertDateTimeForDisplay());

    }
  }, [props.tro]);

  const fetchVehicle = async () => {
    try {
      const data = await getOwnVehicles();
      if (data !== null) {
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicle data', error);
    }
  };

  const convertDateTimeForDisplay = () => {
    const date = new Date(props.tro.tripRequest.startDate);

    return date.toLocaleString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: false,
    });
  };

  const handleAccept = () => {
    setAccepted(true);
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleNotTransform = async () => {
    const success = await notTransformRequest(props.tro.tripRequest.id);
    if (success) {
      handleClose();
    }
  };

  const newRoute = (plz: string, location: string) => {
    if (plz.trim() !== '' && location.trim() !== '') {
      const newRoute: RouteInList = {
        id: 'id_' + routes.length,
        plz: plz,
        location: location,
        position: routes.length + 1,
      };

      setRoutes([...routes, newRoute]);
      setPlzValue('');
      setLocationValue('');
    } else {
      alert('Bitte geben Sie sowohl PLZ als auch Standort ein, bevor Sie eine Route hinzufügen.');
    }
  };

  const removeRoute = (position: number) => {
    const updatedRoutes = routes.filter(route => route.position !== position);

    const reorderedRoutes = updatedRoutes.map((route, index) => ({
      ...route,
      position: index + 1,
    }));

    setRoutes(reorderedRoutes);
  };

  const reorderRoute = (list: RouteInList[], startIndex: number, endIndex: number): RouteInList[] => {
    let result: RouteInList[] = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result = result.map((r, index): RouteInList => ({
      id: r.id,
      position: index + 1,
      location: r.location,
      plz: r.plz,
    }));
    console.log(result);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorderRoute(
      routes,
      result.source.index,
      result.destination.index,
    );

    setRoutes(items);
  };

  const calcListHeigth = (ref: HTMLElement | null) => {
    if (ref?.clientHeight) {
      return (routes.length * ref.clientHeight) + 'px';
    }
    return (routes.length * 40) + 'px';
  };
  const getListStyle = (isDraggingOver: boolean, ref: HTMLElement | null): CSSProperties => ({

    minHeight: isDraggingOver ? calcListHeigth(ref) : 'auto',
  });

  const convertToRoute = (routes: RouteInList[]): CreateRoutePart[] => {
    return routes.map((r): CreateRoutePart => ({
      position: r.position,
      plz: r.plz,
      location: r.location,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const data: PostTransformToOfferDto = {
      additionalSeats: postOfferBody.additionalSeats,
      description: postOfferBody.description,
      route: convertToRoute(routes),
      startDate: postOfferBody.startDate,
      vehicleId: postOfferBody.vehicleId.toString(),
    };

    const success = await transformRequest(props.tro.tripRequest.id, data);
    if (success) {
      await getIncOfferings();
      handleClose();
      return;
    }
    setFeedback('Überprüfe deine Eingaben!');
  };

  const handleSelectVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicle = vehicles.find((v) => v.id === Number(e.target.value));
    if (vehicle) {
      setPostBodyOffer((old) => ({
        ...old,
        vehicleId: vehicle.id.toString(),
      }));
      setVehicleSeats(vehicle.seats);
    } else {
      setVehicleSeats(-1);
    }
  };

  const getIncOfferings = async () => {
    const offerings = await getOfferingsAsRequestingUser();
    if (offerings) {
      setSentOfferings(offerings);

    }
  };

  return (
    <Modal {...props} size="lg" onHide={handleClose}>
      <Modal.Header closeButton />
      <Modal.Body>
        {!accepted ?
          <>
            <Row className="mb-3 text-center">
              <div className="h3">Vielen Dank, dass du {props.tro.tripRequest.requester.firstName} mit nimmst.</div>
              <div className="h5">Du kannst aus dieser Fahrt direkt ein Angebot erstellen, um noch andere Interessierte
                mit zu nehmen.
                <br />
                Alternativ könnt ihr die Fahrt auch nur untereinander aus machen.
              </div>
            </Row>
            <Row className="justify-content-center mb-3">
              <Col xs="auto">
                <Button onClick={handleAccept} className="mainButton w-auto">Angebot erstellen</Button>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xs="auto">
                <a style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleNotTransform}>Alleine
                  fahren</a>
              </Col>
            </Row>
          </>
          :
          <>
            <Form onSubmit={(e) => {
              e.preventDefault();
              newRoute(plzValue, locationValue);
              setPlzValue('');
              setLocationValue('');
              plzInputEl.current?.focus();
            }}>
              <Row className="mb-3">
                <Form.Group as={Col} xs="5" controlId="plz">
                  <Form.Control
                    ref={(el: HTMLElement | null) => {
                      plzInputEl.current = el;
                    }}
                    required
                    type="text"
                    onChange={(e) => setPlzValue(e.target.value)}
                    value={plzValue}
                    placeholder="Postleitzahl" />
                </Form.Group>
                <Form.Group as={Col} xs="5" controlId="location">
                  <Form.Control
                    required
                    type="text"
                    onChange={(e) => setLocationValue(e.target.value)}
                    value={locationValue}
                    placeholder="Standort" />
                </Form.Group>
                <Form.Group as={Col} xs="2" controlId="addRoute">
                  <Button type="submit" className="mainButton w-100">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Form.Group>
              </Row>
            </Form>

            <div className="mb-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps}
                         ref={provided.innerRef}
                         style={getListStyle(snapshot.isDraggingOver, listElement.current)}
                    >
                      {routes.map((route, index) => (
                        <Draggable key={route.id} draggableId={route.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                listElement.current = el;
                              }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                              )}
                            >
                              <Row className="p-3 add-shadow" style={{ borderRadius: '10px' }}>
                                <Col xs={1} style={alignCenter}>
                                  <span>{route.position}</span>
                                </Col>
                                <Col style={alignCenter}>
                                  <span>PLZ: <strong>{route.plz}</strong></span>
                                </Col>
                                <Col style={alignCenter}>
                                  <span>Location: <strong>{route.location}</strong></span>
                                </Col>
                                <Col xs={'auto'} style={alignCenter}>
                                  <Button className="add-shadow" onClick={() => removeRoute(route.position)}
                                          variant="danger">
                                    <FontAwesomeIcon icon={faX} />
                                  </Button>
                                </Col>
                                <Col xs={'auto'} style={{ ...alignCenter, color: 'gray', fontSize: '25px' }}>
                                  <FontAwesomeIcon icon={faBars} />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <Form onSubmit={handleSubmit}>

              <Row>
                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>
                    Wann geht es los?
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    onChange={(e) => setPostBodyOffer((old) => ({
                      ...old,
                      startDate: e.target.value,
                    }))}
                    placeholder="Datum"
                  />
                  <Form.Text>
                    Gewünscht ist {dateTimeDisplay}
                  </Form.Text>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="vehicle">
                  <Form.Select
                    required
                    onChange={handleSelectVehicle}
                  >
                    <option value="">Fahrzeug</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="vehicleSeatNumber">
                  <Form.Label>
                    Wie viel Plätze beanspruchst du für dich?
                  </Form.Label>
                  <Form.Control
                    disabled={vehicleSeats == -1 || (vehicleSeats -props.tro.tripRequest.seats) <= 1}
                    required
                    type="number"
                    step={1}
                    min={1}
                    max={vehicleSeats - props.tro.tripRequest.seats - 1}
                    placeholder="Sitzplätze"
                    onChange={(e) => setPostBodyOffer((old) => ({
                      ...old,
                      additionalSeats: Number(e.target.value),
                    }))}
                  />
                  <Form.Text>
                    In deinem Fahrzeug muss noch Platz für mindestens eine weitere Person sein um eine Anzeige erstellen
                    zu können
                  </Form.Text>
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Control
                  required
                  as="textarea"
                  rows={3}
                  placeholder="Beschreibung"
                  onChange={(e) => setPostBodyOffer((old) => ({
                    ...old,
                    description: e.target.value,
                  }))}
                />
              </Form.Group>

              <Row className="justify-content-end">
                {!feedback ?
                  <></>
                  :
                  <Col>
                    <Form.Text style={{ color: 'red' }}>
                      {feedback}
                    </Form.Text>
                  </Col>
                }
                <Col xs="auto">
                  <Button type="submit" className="mainButton">Fahrt anlegen</Button>
                </Col>

              </Row>
            </Form>
          </>
        }
      </Modal.Body>
    </Modal>
  );
}

export default TransformToOfferModal;
