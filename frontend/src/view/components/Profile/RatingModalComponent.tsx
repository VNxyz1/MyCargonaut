import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { getOwnOffers } from "../../../services/offerService.ts";
import { Offer, OfferList } from "../../../interfaces/Offer.ts";
//import { UserLight} from "../../../interfaces/UserLight.ts";
import {ratingDriver, ratingPassenger } from "../../../services/ratingService.tsx";
//import {CreateVehicleData, VehicleTypes} from "../../../interfaces/Vehicle.ts";
import { JustDriverRating , JustPassengerRating} from "../../../interfaces/Rating.ts";
import { StarRating } from "../Ratings/StarRating.tsx";

interface RatingModalProps extends ModalProps {
    onHide: () => void;
}

const RatingModalComponent: React.FC<RatingModalProps> = (props: RatingModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);
    const [offers, setOffers] = useState<OfferList>();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    //const [selectedOfferDriver, setSelectedOfferDriver] = useState<Offer | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | null>(null); // Zustand für ausgewählten Clienten
    
    useEffect(() => {
        if (!props.show) {
            //setValidated(false);

            setSelectedOffer(null);
            setSelectedClient(null);
        }
    }, [props.show]);
    
    useEffect(() => {
        const fetchData = async () => {
            const offersData = await getOwnOffers();
            const offersList: Offer[] = [];
            if (offersData) {
                offersData.offerList.forEach((offer) => {
                    if(new Date(offer.startDate) < new Date()){
                        offersList.push(offer);
                    }
                });
                setOffers({offerList: offersList});
            }
        };

        fetchData();
    }, []);


    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
        if (form.checkValidity()) {
            if(selectedOffer){
                //ToDO: eigene Id!
            if(selectedOffer.provider.id === 0){
            const formData: JustDriverRating = {
                rateeId: selectedOffer.provider.id,
                punctuality: Number(form.elements["punctuality"]),
                reliability: Number(form.elements["reliability"]),
                cargoArrivedUndamaged: Number(form.elements["cargoArriveUndamaged"]),
                passengerPleasantness: Number(form.elements["passengerPleasentness"])
            };
        
            ratingDriver(selectedOffer.id, formData)
                .then()
                .catch(error => 
                    {console.error("Error rating driver:", error);
                });
            }
                //ToDO: eigene Id!
        if(selectedOffer.provider.id === 1){
            const formData: JustPassengerRating = {
                rateeId: selectedOffer.provider.id,
                punctuality: Number(form.elements["punctuality"]),
                reliability: Number(form.elements["reliability"]),
                comfortDuringTrip: Number(form.elements["comfortDuringTrip"])
            };
        
            ratingPassenger(selectedOffer.id, formData)
                .then()
                .catch(error => 
                    {console.error("Error rating passenger:", error);
                });
            }
        }
            props.onHide();
        
    }
    };

    const handleOfferChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOfferId = parseInt(event.target.value);
        const selectedOffer = offers?.offerList.find(offer => offer.id === selectedOfferId) || null;
        setSelectedOffer(selectedOffer);
        setSelectedClient(null);
    };

    const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClientId = parseInt(event.target.value);
        setSelectedClient(selectedClientId);


    };



    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title> FAHRT BEWERTEN </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="routes">
                            <Form.Select required onChange = {handleOfferChange}>
                                <option value="">Fahrt auswählen</option>
                                {offers && offers.offerList.map((offer, index) => {
                                    const routeText = offer.route.map(routePart => routePart.plz.location).join(" -> ");
                                    return (
                                        <option key={index} value={offer.id}>
                                            {routeText} 
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row>
                    {selectedOffer && selectedOffer.clients.length > 0 && (
                            <Form.Group as={Col} className="mb-3" controlId="users">
                                <Form.Select required onChange={handleClientChange}>
                                    <option value="">Person auswählen</option>
                                    {selectedOffer.clients.map((client, index) => (
                                        <option key={index} value={client.id}>
                                            {`${client.firstName} ${client.lastName}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Row>
                    {selectedClient && (
                        <Row>
                            <div>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="punctuality">
                                        <Form.Label>Pünktlichkeit</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="reliability">
                                        <Form.Label>Zuverlässigkeit</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                            </div>
                        </Row>
                    )}
                    {selectedClient && selectedClient !== 1 && (
                        <Row>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="comfortDuringTrip">
                                        <Form.Label>Atmosphäre</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                                                    
                        </Row>
                    )}
                    {selectedClient && selectedClient === 0 && (
                        <Row>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="cargoArrivedUndamaged">
                                        <Form.Label>Ohne Schaden</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="passengerPleasantness">
                                        <Form.Label>Atmosphäre</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                        </Row>
                    )}
                    <Row>
                        <Col xs={12} md="auto" className="d-flex justify-content-end ms-auto">
                            <Button type="submit" className="mainButton">Bewerten!</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RatingModalComponent;