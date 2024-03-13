import React, { useState, useEffect, CSSProperties, useRef } from 'react';
import { Modal, ModalProps } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { Vehicle } from '../../../interfaces/Vehicle';
import { useAuth } from '../../../services/authService';
import { User } from '../../../interfaces/User';
import { getOwnVehicles } from '../../../services/vehicleService';
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
  NotDraggingStyle,
  DraggingStyle,
} from 'react-beautiful-dnd';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Route {
  plz: string;
  location: string;
  position: number;
}

interface RouteInList {
  id: string;
  plz: string;
  location: string;
  position: number;
}

interface CreateTripModalComponent extends ModalProps {
  onHide: () => void;
  userData: User | null;
}
const getItemStyle = (isDragging: boolean, draggableStyle:  DraggingStyle | NotDraggingStyle | undefined): CSSProperties => ({
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const alignCenter: CSSProperties = {display: 'flex', textAlign: 'start', alignItems: 'center', paddingTop: "2px", paddingBottom: "2px"};


const CreateTripModalComponent: React.FC<CreateTripModalComponent> = (props: CreateTripModalComponent) => {
  const [plzValue, setPlzValue] = useState<string>('');
  const [locationValue, setLocationValue] = useState<string>('');
  const [routes, setRoutes] = useState<RouteInList[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [descriptionValue, setDescription] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [seatNumberValue, setSeatNumberValue] = useState<number>(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { isAuthenticated } = useAuth();
  const listElement = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!props.show) {
      setRoutes([]);
    }
    if (isAuthenticated && props.userData) {
      fetchVehicle();
    }
  }, [isAuthenticated && props.show && props.userData]);
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await fetch('/offer', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          route: convertToRoute(routes),
          vehicleId: selectedVehicle?.id,
          description: descriptionValue,
          startDate: dateValue,
          bookedSeats: seatNumberValue,
        }),
      });
      if (response.ok) {
        console.log('Anfrage erfolgreich gesendet');
      } else {
        console.error('Fehler bei der Anfrage an das Backend');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Anfrage:', error);
    }

    props.onHide();
  };

  const newRoute = (plz: string, location: string) => {
    if (plz.trim() !== '' && location.trim() !== '') {
      const newRoute: RouteInList = {
        id: "id_" + routes.length,
        plz: plz,
        location: location,
        position: routes.length+1,
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
      position: index+1,
    }));

    setRoutes(reorderedRoutes);
  };

  const reorderRoute = (list: RouteInList[], startIndex: number, endIndex: number): RouteInList[] => {
    let result: RouteInList[] = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result = result.map((r , index): RouteInList => ({
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
      return (routes.length * ref.clientHeight) + "px"
    }
    return (routes.length * 40) + "px"
  }
  const getListStyle = (isDraggingOver: boolean, ref: HTMLElement | null ): CSSProperties => ({

    minHeight: isDraggingOver ? calcListHeigth(ref) : "auto",
  });

  const convertToRoute = (routes: RouteInList[]): Route[] => {
    return routes.map((r): Route=> ({
      position: r.position,
      plz: r.plz,
      location: r.location
    }))
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          FAHRT ANLEGEN
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} xs='5' controlId="plz">
              <Form.Control
                type="text"
                onChange={(e) => setPlzValue(e.target.value)}
                value={plzValue}
                placeholder="Postleitzahl" />
            </Form.Group>
            <Form.Group as={Col} xs='5' controlId="location">
              <Form.Control
                type="text"
                onChange={(e) => setLocationValue(e.target.value)}
                value={locationValue}
                placeholder="Standort" />
            </Form.Group>
            <Form.Group as={Col} xs='2' controlId="addRoute">
              <Button onClick={() => {
                newRoute(plzValue, locationValue);
                setPlzValue('');
                setLocationValue('');
              }} className="mainButton w-100">+</Button>
            </Form.Group>
          </Row>
          <div className="mb-3">
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
                            ref={(el)=> {
                              provided.innerRef(el)
                              listElement.current = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Row className='px-3'>
                              <Col style={alignCenter}>
                                <span>{route.position}</span>
                              </Col>
                              <Col style={alignCenter}>
                                <span><strong>PLZ:</strong> {route.plz}</span>
                              </Col>
                              <Col style={alignCenter}>
                                <span><strong>Location:</strong> {route.location}</span>
                              </Col>
                              <Col style={alignCenter}>
                                <Button onClick={() => removeRoute(route.position)} variant="danger">X</Button>
                              </Col>
                              <Col style={{ ...alignCenter, color: 'gray', fontSize: "25px"}}>
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
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="date">
              <Form.Control
                required
                type="date"
                onChange={(e) => setDateValue(e.target.value)}
                placeholder="Datum" />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="vehicle">
              <Form.Select
                required
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVehicle(vehicles.filter((vehicle: {
                  name: string;
                }) => vehicle.name === e.target.value)[0])}
                value={selectedVehicle?.name}
              >
                <option value="">Fahrzeug</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={3} className="mb-3" controlId="vehicleSeatNumber">
              <Form.Control
                required
                type="number"
                step={1}
                min={1}
                max={20}
                placeholder="Sitzplätze"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeatNumberValue(parseInt(e.target.value))}
                value={seatNumberValue}
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Control onChange={(e) => setDescription(e.target.value)} as="textarea" rows={3}
                          placeholder="Beschreibung (optional)" />
          </Form.Group>

          <Row className="justify-content-end">
            <Col xs='auto'>
              <Button type="submit" className="mainButton">Fahrt anlegen</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTripModalComponent;
