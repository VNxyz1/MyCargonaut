import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./view/pages/Login-Page.tsx";

function RoutesComponent() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesComponent;
