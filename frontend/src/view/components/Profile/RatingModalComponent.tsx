import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { getOwnOffers , getPassengerOffers } from "../../../services/offerService.tsx";
import { Offer, OfferList } from "../../../interfaces/Offer.ts";
import {getRated, ratingDriver, ratingPassenger } from "../../../services/ratingService.tsx";
import { JustDriverRating , JustPassengerRating} from "../../../interfaces/Rating.ts";
import { StarRating } from "../Ratings/StarRating.tsx";
import { getLoggedInUser } from "../../../services/userService.tsx";
import { UserLight } from "../../../interfaces/UserLight.ts";
import { getAUser } from "../../../services/userService.tsx";
import { User } from "../../../models/User.tsx";

interface RatingModalProps extends ModalProps {
    onHide: () => void;
}

const RatingModalComponent: React.FC<RatingModalProps> = (props: RatingModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);
    const [offers, setOffers] = useState<OfferList>();
    const [userId, setUserId] = useState<number | null>(null);
    const [passengerOffers, setPassengerOffers] = useState<OfferList>();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [selectedClient, setSelectedClient] = useState<UserLight | null>(null);
    const [clientIds, setClientIds] = useState<number[] | null>(null);
    const [switched, setSwitched] = useState<boolean>(false);
    const [clientList, setlClientList] = useState<User[] | null>(null);
    const [punctualityRating, setPunctualityRating] = useState<number>(3);
    const [reliabilityRating, setReliabilityRating] = useState<number>(3);
    const [comfortDuringTripRating, setComfortDuringTripRating] = useState<number>(3);
    const [cargoArrivedUndamagedRating, setCargoArrivedUndamagedRating] = useState<number>(3);
    const [passengerPleasantnessRating, setPassengerPleasantnessRating] = useState<number>(3);

    const checkingRated = async (id: number): Promise<boolean> => {
        try {
            const ratingData = await getRated(id);
            if (!ratingData) return false;
            if (ratingData.ratees.length > 0) {
                const ratingCheck = ratingData.ratees.some(ratee => ratee.rated === false);
                const userList: number[] = [];
                if(ratingCheck){
                    const filteredRating = ratingData.ratees.filter(forList => forList.rated === false);
                    filteredRating.forEach(driverOrPassenger => {
                        userList.push(driverOrPassenger.rateeId);
                    });
                    setClientIds(userList);
                }
                return ratingCheck
            }
            return false;
        } catch (error) {
            console.error("Error while checking rating:", error);
            return false;
        }
    };

    const listingUser = async (id: number): Promise<User | null> => {
        try {
            const userData = await getAUser(id);
            return userData;
        } catch (error) {
            console.error("Error while getting user:", error);
            return null;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
        if (form.checkValidity()) {
            if(selectedOffer){
                if(selectedOffer.provider.id !== userId){

            const formData: JustDriverRating = {
                rateeId: selectedOffer.provider.id,
                punctuality: punctualityRating,
                reliability: reliabilityRating,
                cargoArrivedUndamaged: cargoArrivedUndamagedRating,
                passengerPleasantness: passengerPleasantnessRating
            };
        
            ratingDriver(selectedOffer.id, formData)
                .then()
                .catch(error => 
                    {console.error("Error rating driver:", error);
                });
            }
        if(selectedOffer.provider.id === userId){

            if (selectedClient){
            const formData: JustPassengerRating = {
                rateeId: selectedClient.id,
                punctuality: punctualityRating,
                reliability: reliabilityRating,
                comfortDuringTrip: comfortDuringTripRating
            };

        
            ratingPassenger(selectedOffer.id, formData)
                .then()
                .catch(error => 
                    {console.error("Error rating passenger:", error);
                });
            }}
        }
            props.onHide();
        
    }
    };

    const userPackage = async (): Promise<User [] | null> => {
        try {
            const userList: User[] = [];
            if (clientIds) {
                for (const id of clientIds) {
                const user = await listingUser(id);
                if (user) {
                    userList.push(user);
                }
            }
            setlClientList(userList);
        }
        return userList;
            } catch (error) {
                console.error("Error while creating list of user:", error);
                return null;
            }
        };

    const handleOfferChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOffer(null);
        setSelectedClient(null);
        const selectedOfferId = parseInt(event.target.value);
        const selectedOffers = offers?.offerList.find(offer => offer.id === selectedOfferId) || null;
        const selectedPassengerOffers = passengerOffers?.offerList.find(offer => offer.id === selectedOfferId) || null;

        if (selectedOffers){
            setSelectedOffer(selectedOffers);
            setSwitched(false); 
        }
        if (selectedPassengerOffers){
            setSelectedOffer(selectedPassengerOffers);
            setSwitched(true);
        }
        userPackage();
        const driverElement = document.getElementById('driver') as HTMLSelectElement | null;
        const passengerElement = document.getElementById('passenger') as HTMLSelectElement | null; 
        if (driverElement) driverElement.selectedIndex = 0;
        if (passengerElement) passengerElement.selectedIndex = 0;
    };

    const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClientId = parseInt(event.target.value);
        const selectedClient = selectedOffer?.clients.find(client => client.id === selectedClientId) || null;
        setSelectedClient(selectedClient);
    };

    const handleDriverChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDriverId = parseInt(event.target.value);
        if(selectedDriverId == 0) setSelectedClient(null);
        else{
        const selectedProvider = selectedOffer?.provider || null;
        setSelectedClient(selectedProvider);
        }
    };

    useEffect(() => {
        if (!props.show) {
            setValidated(false);
            setSelectedOffer(null);
            setSelectedClient(null);
        }
    }, [props.show]);

    useEffect(() => {
        const fetchData = async () => {

            const userData = await getLoggedInUser();

            if (userData && userData.id) {
                setUserId(userData.id);

            }
            
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {

            const offersData = await getOwnOffers();
            const offersList: Offer[] = [];
            if (offersData) {
                for (const offer of offersData) {
                    if (new Date(offer.startDate) < new Date()) {
                        const needRating = await checkingRated(offer.id);
                        if (needRating) {
                            offersList.push(offer);
                        }
                    }
                }
                setOffers({offerList: offersList});
            }
        };
        fetchData();
    }, [validated]);

    useEffect(() => {
        const fetchData = async () => {

            const offersData = await getPassengerOffers();
            const offersList: Offer[] = [];
            if (offersData) {
                for (const offer of offersData) {
                    if (new Date(offer.startDate) < new Date()) {
                        const needRating = await checkingRated(offer.id);
                        if (needRating) {
                            offersList.push(offer);
                        }
                    }
                }
                setPassengerOffers({offerList: offersList});
            }
        };
        fetchData();
    }, [validated]);

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
                    
                    {selectedOffer && selectedOffer.clients.length > 0 && selectedOffer.provider.id === userId && clientList &&(
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="driver">
                                <Form.Select required onChange={handleClientChange}>
                                    <option value="">Mitfahrer auswählen</option>
                                    {clientList.map((client, index) => (
                                        <option key={index} value={client.id}>
                                            {`${client.firstName} ${client.lastName}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            </Row>
                        )}                    
                        
                        {selectedOffer && selectedOffer.clients.length > 0 && selectedOffer.clients.find(client => client.id === userId) && (
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="passenger">
                                    <Form.Select required onChange={handleDriverChange}>
                                        <option value="">Fahrer auswählen</option>
                                        <option value={`${selectedOffer.provider.id}`}>{`${selectedOffer.provider.firstName} ${selectedOffer.provider.lastName}`}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                        )}

                    
                    {selectedClient && (
                        <Row>
                            <div>
                                <Row>
                                    <div>Pünktlichkeit</div>
                                    <Form.Group as={Col} className="mb-3" controlId="punctuality">
                                    <StarRating
                                        initialValue={3}
                                        onRatingChange={(value) => {
                                            setPunctualityRating(value);
                                        }}
                                    />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <div>Zuverlässigkeit</div>
                                    <Form.Group as={Col} className="mb-3" controlId="reliability">
                                    <StarRating
                                        initialValue={3}
                                        onRatingChange={(value) => {
                                            setReliabilityRating(value);
                                        }}
                                    />
                                    </Form.Group>
                                </Row>
                            </div>
                        </Row>
                    )}
                    {selectedClient && !switched && (
                        <Row>
                                <Row>
                                    <div>Atmosphäre</div>
                                    <Form.Group as={Col} className="mb-3" controlId="comfortDuringTrip">
                                    <StarRating
                                        initialValue={3}
                                        onRatingChange={(value) => {
                                            setComfortDuringTripRating(value);
                                        }}
                                    />
                                    </Form.Group>
                                </Row>
                                                    
                        </Row>
                    )}
                    {selectedClient && switched && (
                        <Row>
                                <Row>
                                    <div>Ohne Schaden</div>
                                    <Form.Group as={Col} className="mb-3" controlId="cargoArrivedUndamaged">
                                    <StarRating
                                        initialValue={3}
                                        onRatingChange={(value) => {
                                            setCargoArrivedUndamagedRating(value);
                                        }}
                                    />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <div>Atmosphäre</div>
                                    <Form.Group as={Col} className="mb-3" controlId="passengerPleasantness">
                                    <StarRating
                                        initialValue={3}
                                        onRatingChange={(value) => {
                                            setPassengerPleasantnessRating(value);
                                        }}
                                    />
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