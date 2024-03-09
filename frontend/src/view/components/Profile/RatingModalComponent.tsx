import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { getOwnOffers , getPassengerOffers } from "../../../services/offerService.tsx";
import { Offer, OfferList } from "../../../interfaces/Offer.ts";
import {ratingDriver, ratingPassenger } from "../../../services/ratingService.tsx";
import { JustDriverRating , JustPassengerRating} from "../../../interfaces/Rating.ts";
import { StarRating } from "../Ratings/StarRating.tsx";
import { getLoggedInUser } from "../../../services/userService.tsx";

interface RatingModalProps extends ModalProps {
    onHide: () => void;
}

const RatingModalComponent: React.FC<RatingModalProps> = (props: RatingModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);
    const [offers, setOffers] = useState<OfferList>();
    const [userId, setUserId] = useState<number | null>(null);
    const [passengerOffers, setPassengerOffers] = useState<OfferList>();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | null>(null);
    const [switched, setSwitched] = useState<boolean>(false);
    
    useEffect(() => {
        if (!props.show) {
            //setValidated(false);

            setSelectedOffer(null);
            setSelectedClient(null);
        }
    }, [props.show]);

    useEffect(() => {
        const fetchData = async () => {

            const userData = await getLoggedInUser();
            console.log("Der User " + userData);
            if (userData && userData.id) {
                setUserId(userData.id);
                console.log("Die UserID: " + userData.id);
            }
            console.log("Die UserID: ANSCHEINEND LEER");
            
        };
        fetchData();
    }, []);
    
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
                console.log("Die erste Liste: " + offersList);
                setOffers({offerList: offersList});
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {

            const offersData = await getPassengerOffers();
            const offersList: Offer[] = [];
            if (offersData) {
                offersData.offerList.forEach((offer) => {
                    if(new Date(offer.startDate) < new Date()){
                        offersList.push(offer);
                    }
                });
                console.log("Die erste Liste: " + offersList);
                setPassengerOffers({offerList: offersList});
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
                if(selectedOffer.provider.id !== userId){
                console.log("Driver wird bewertet!!!");
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
        if(selectedOffer.provider.id === userId){
            console.log("Passenger werden bewertet!!!");
            const formData: JustPassengerRating = {
                //ToDo: PassengerId verwenden
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
        const selectedOffers = offers?.offerList.find(offer => offer.id === selectedOfferId) || null;
        const selectedPassengerOffers = passengerOffers?.offerList.find(offer => offer.id === selectedOfferId) || null;
        console.log("Die Listen: " + selectedOffers);
        console.log("Die anderen Listen: " + selectedPassengerOffers);
        if (selectedOffers){setSelectedOffer(selectedOffers); setSwitched(false);console.log("Bei 1")}
        if (selectedPassengerOffers){setSelectedOffer(selectedPassengerOffers); setSwitched(true); console.log("Bei 2")}
        setSelectedClient(null);
        console.log("Hier ist der Offer: " + selectedOffer?.id)
        console.log("Hier ist die Person: " + selectedOffer?.provider.firstName)
        console.log("Die UserID: " + userId);
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
                                {passengerOffers && passengerOffers.offerList.map((offer, index) => {
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
                    
                    {selectedOffer && selectedOffer.clients.length > 0 && selectedOffer.provider.id === userId &&(
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="driver">
                                <Form.Select required onChange={handleClientChange}>
                                    <option value="">Person auswählen1</option>
                                    {selectedOffer.clients.map((client, index) => (
                                        <option key={index} value={client.id}>
                                            Testy{`${client.firstName} ${client.lastName}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            </Row>
                        )}                    
                        
                        {selectedOffer && selectedOffer.clients.length > 0 && selectedOffer.clients.find(client => client.id === userId) && (
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="passenger">
                                    <Form.Select required onChange={handleClientChange}>
                                        <option value="">Person auswählen2</option>
                                        <option value={`${selectedOffer.provider.id}`}>{`${selectedOffer.provider.firstName} ${selectedOffer.provider.lastName}`}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                        )}

                    
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
                    {selectedClient && !switched && (
                        <Row>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="comfortDuringTrip">
                                        <Form.Label>Atmosphäre</Form.Label>
                                        <StarRating initialValue={3} />
                                    </Form.Group>
                                </Row>
                                                    
                        </Row>
                    )}
                    {selectedClient && switched && (
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