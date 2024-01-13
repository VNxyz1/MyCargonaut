import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./view/pages/Home-Page.tsx";
import LoginAndRegisterPage from "./view/pages/Login-And-Register-Page.tsx";
import ImprintPage from "./view/pages/Imprint-Page.tsx";
import ProfilPage from "./view/pages/Profil-Page.tsx";
import UserPage from "./view/pages/User-Page.tsx";
import PrivacyPage from "./view/pages/Privacy-Page.tsx";
import NavigationComponent from "./view/components/NavigationComponent.tsx";
import FooterComponent from "./view/components/FooterComponent.tsx";
import SearchTransportPage from "./view/pages/Search-Transport-Page.tsx";
import MessagesPage from "./view/pages/Messages-Page";
import TripDetailPage from "./view/pages/Trip-Detail-Page.tsx";
import {useEffect, useState} from "react";
import {Offer} from "./interfaces/Offer.ts";
import BadRequestPage from "./view/pages/404-Bad-Request.tsx";

function RoutesComponent() {
    // @ts-ignore wird vielleicht noch gebraucht
    const [offers, setOffers] = useState<Offer[]>([]);


    useEffect(() => {
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

        getAllPublicOffers()
            .catch(console.error);
    }, []);


    return (
        <BrowserRouter>
            <NavigationComponent/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginAndRegisterPage/>}/>
                <Route path="/imprint" element={<ImprintPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/profil" element={<ProfilPage />} />
                <Route path="/user/:userId" element={<UserPage />} />
                <Route path="/search-transport" element={<SearchTransportPage offers={offers}  />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/trip/:type/:id" element={<TripDetailPage/>} />
                <Route path="/404" element={<BadRequestPage/>} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
}

export default RoutesComponent;
