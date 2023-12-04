import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginAndRegisterPage from "./view/pages/Login-And-Register-Page.tsx";

function RoutesComponent() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginAndRegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesComponent;
