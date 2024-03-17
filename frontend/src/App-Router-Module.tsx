import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./view/pages/Home-Page.tsx";
import LoginAndRegisterPage from "./view/pages/Login-And-Register-Page.tsx";
import ProfilPage from "./view/pages/Profil-Page.tsx";
import UserPage from "./view/pages/User-Page.tsx";
import NavigationComponent from "./view/components/NavigationComponent.tsx";
import FooterComponent from "./view/components/FooterComponent.tsx";
import SearchTransportPage from "./view/pages/Search-Transport-Page.tsx";
import TripDetailPage from "./view/pages/Trip-Detail-Page.tsx";
import {useEffect, useState} from "react";
import {Offer} from "./interfaces/Offer.ts";
import {TripRequest} from "./interfaces/TripRequest.ts"
import BadRequestPage from "./view/pages/404-Bad-Request.tsx";
import ChatPage from "./view/pages/Chat-Page.tsx";
import AlertComponent from "./view/components/AlertComponent.tsx";



function RoutesComponent( ) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [requests, setRequests] = useState<TripRequest[]>([]);

    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success'); // Neuer State für den Alert-Typ

    const handleShowAlert = (message: string, type: 'success' | 'error' | 'info' = 'success') => { // Default-Wert für den Alert-Typ
        setAlertMessage(message);
        setAlertType(type); // Setzen Sie den Alert-Typ basierend auf dem übergebenen Wert
        setShowAlert(true);
    };


    useEffect(() => {
        (async ()=> {
            await getAllPublicOffers();
            await getAllPublicRequests();
        })()
    }, []);

    const getAllPublicOffers = async ()  => {
        try {
            const res = await fetch("/offer");
            if (res.ok) {
                const data = await res.json();
                setOffers(data.offerList);
                console.log(data.offerList);
            } else {
                console.error("Error fetching offers");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getAllPublicRequests = async ()  => {
        try {
            const res = await fetch("/request/all");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.tripRequests);
                console.log(data.tripRequests);
            } else {
                console.error("Error fetching offers");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const reRender = async () => {
        await getAllPublicOffers();
        await getAllPublicRequests();
    }

    return (
        <BrowserRouter>
            <NavigationComponent/>
            <AlertComponent message={alertMessage} type={alertType} show={showAlert} onClose={() => setShowAlert(false)} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginAndRegisterPage handleShowAlert={handleShowAlert} />} />
                <Route path="/profil" element={<ProfilPage reRender={reRender} handleShowAlert={handleShowAlert}/>} />
                <Route path="/user/:userId" element={<UserPage />} />
                <Route path="/search-transport" element={<SearchTransportPage reRender={reRender} offers={offers} requests={requests} />} />
                <Route path="/messages" element={<ChatPage />} />
                <Route path="/trip/:type/:id" element={<TripDetailPage/>} />
                <Route path="/404" element={<BadRequestPage/>} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
}

export default RoutesComponent;
