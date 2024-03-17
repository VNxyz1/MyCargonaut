import {Offer} from "../../../interfaces/Offer.ts";
import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import ProfileDisplay from "./ProfileDisplay.tsx";
import TransitRequestModal from "./Transit-Request-Modal.tsx";
import NotLoggedInModal from "../Login-Regist/Not-Logged-In-Modal.tsx";
import {TripRequest} from "../../../interfaces/TripRequest.ts";
import { useAuth } from "../../../services/authService.tsx";
import { User } from "../../../interfaces/User.ts";
import { getLoggedInUser } from "../../../services/userService.tsx";
import { endTrip, startTrip } from "../../../services/offerService.tsx";
import TripDeleteModal from "./Trip-Delete-Modal.tsx";


function DetailSidebar(
    props: {
        trip: Offer|TripRequest
    }
) {
    const [showTransitRequestModal, setShowTransitRequestModal] = useState(false);
    const [showNotLoggedInModal, setShowNotLoggedInModal] = useState(false);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const {isAuthenticated} = useAuth();
    

    const fetchLoggedInUser = async () => {
        const data = await getLoggedInUser();
        if (data !== null) {
            setUserData(data as any);
        }
    };
    useEffect(() => {
        if (isAuthenticated) {
            fetchLoggedInUser();
        } 
    }, [isAuthenticated]);
    useEffect(() => {
        const item = localStorage.getItem('isAuthenticated');
        if(item) {
            setIsLoggedIn(JSON.parse(item));
        }

    }, []);
    
    const isProvider = () =>{
        
        if('provider' in props.trip && userData){
            if(userData!.id == props.trip.provider.id) return true;
        }
        return false;
    }
 
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
    const handleStartTrip = () => {
        if(isAuthenticated) {
            startTrip(props.trip.id);
        } else {
            setShowNotLoggedInModal(true);
        }
    }
    const handleEndTrip = () => {
        if(isAuthenticated) {
            endTrip(props.trip.id);
        } else {
            setShowNotLoggedInModal(true);
        }
    }

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    }

    const handleClose = () => {
        setShowTransitRequestModal(false);
        setShowNotLoggedInModal(false);
        setShowDeleteModal(false);
        console.log("closed")
    }

   
    return (
        <>
            <div className="mt-4" style={{width: "100%"}}>
                <Card>
                    <Card.Header>
                        
                        {isProvider()?" ":<Button onClick={handleOpenRequestModal} className="mainButton w-100 mb-2">
                            Angebot machen
                        </Button>}
                        {isProvider()?" ":<Button onClick={handleOpenChatPage} className="mainButton w-100 mb-2">
                            Nachricht schreiben
                        </Button>}
                        {isProvider()?" ":<Button onClick={handleAddToWatchlist} className="mainButton w-100 mb-2">
                            Zur Merkliste hinzufügen
                        </Button>}
                        {!isProvider()?" ":<Button onClick={handleStartTrip} className="mainButton w-100 mb-2">
                            Start Trip
                        </Button>}
                        {!isProvider()?" ":<Button onClick={handleEndTrip} className="mainButton w-100 mb-2">
                            End Trip
                        </Button>}
                        {!isProvider()?" ":<Button onClick={handleOpenDeleteModal} className="mainButton w-100 mb-2">
                            Delete Trip
                        </Button>}
                    </Card.Header>
                    <Card.Body>
                        <ProfileDisplay user={"provider" in props.trip ? props.trip.provider : props.trip.requester}/>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                        <span>{"provider" in props.trip ? "Anzeigen-ID" : "Gesuch-ID"}</span>
                        <span>{props.trip.id}</span>
                    </Card.Footer>
                </Card>

            </div>
            <TransitRequestModal show={showTransitRequestModal} onClose={handleClose} offerId={props.trip.id}/>
            <NotLoggedInModal show={showNotLoggedInModal} onClose={handleClose}/>
            <TripDeleteModal show={showDeleteModal} onClose={handleClose} trip={props.trip}/>
        </>
    )
    
}

export default DetailSidebar
