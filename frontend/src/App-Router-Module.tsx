import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./view/pages/Home-Page.tsx";
import LoginAndRegisterPage from "./view/pages/Login-And-Register-Page.tsx";
import ImprintPage from "./view/pages/Imprint-Page.tsx";
import ProfilPage from "./view/pages/Profil-Page.tsx";
import PrivacyPage from "./view/pages/Privacy-Page.tsx";
import NavigationComponent from "./view/components/NavigationComponent.tsx";
import FooterComponent from "./view/components/FooterComponent.tsx";

function RoutesComponent() {

    return (
        <BrowserRouter>
            <NavigationComponent/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginAndRegisterPage/>}/>
                <Route path="/imprint" element={<ImprintPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/profil" element={<ProfilPage />} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
}

export default RoutesComponent;
