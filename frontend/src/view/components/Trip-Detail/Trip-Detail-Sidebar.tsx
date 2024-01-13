import {Offer} from "../../../interfaces/Offer.ts";
import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import ProfileDisplay from "./ProfileDisplay.tsx";
import TransitRequestModal from "./Transit-Request-Modal.tsx";
import NotLoggedInModal from "../Login-Regist/Not-Logged-In-Modal.tsx";
import {TripRequest} from "../../../interfaces/TripRequest.ts";


function DetailSidebar(
    props: {
        trip: Offer|TripRequest
    }
) {
    const [showTransitRequestModal, setShowTransitRequestModal] = useState(false);
    const [showNotLoggedInModal, setShowNotLoggedInModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    useEffect(() => {
        const item = localStorage.getItem('isAuthenticated');
        if(item) {
            setIsLoggedIn(JSON.parse(item));
        }

    }, []);


    const handleOpenRequestModal = () => {
        if(isLoggedIn) {
            setShowTransitRequestModal(true);
        } else {
            setShowNotLoggedInModal(true);
        }
    }

    const handleOpenChatPage = () => {
        if(isLoggedIn) {
            //todo
            alert("not implemented");
        } else {
            setShowNotLoggedInModal(true);
        }
    }

    const handleAddToWatchlist = () => {
        if(isLoggedIn) {
            //todo
            alert("not implemented");
        } else {
            setShowNotLoggedInModal(true);
        }
    }

    const handleClose = () => {
        setShowTransitRequestModal(false);
        setShowNotLoggedInModal(false);
        console.log("closed")
    }


    return (
        <>
            <div className="mt-4" style={{width: "100%"}}>
                <Card>
                    <Card.Header>
                        <Button onClick={handleOpenRequestModal} className="mainButton w-100 mb-2">
                            Angebot machen
                        </Button>
                        <Button onClick={handleOpenChatPage} className="mainButton w-100 mb-2">
                            Nachricht schreiben
                        </Button>
                        <Button onClick={handleAddToWatchlist} className="mainButton w-100 mb-2">
                            Zur Merkliste hinzufügen
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <ProfileDisplay user={"provider" in props.trip ? props.trip.provider : props.trip.requester}/>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                        <span>Anzeigen-ID</span>
                        <span>{props.trip.id}</span>
                    </Card.Footer>
                </Card>

            </div>
            <TransitRequestModal show={showTransitRequestModal} onClose={handleClose} offerId={props.trip.id}/>
            <NotLoggedInModal show={showNotLoggedInModal} onClose={handleClose}/>
        </>

    )
}

export default DetailSidebar
