import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Offer} from "../../interfaces/Offer.ts";
import DetailComponent from "../components/Trip-Detail/Detail-Component.tsx";
import {Col, Container, Row} from "react-bootstrap";
import DetailSidebar from "../components/Trip-Detail/Trip-Detail-Sidebar.tsx";
import {getOfferById} from "../../services/offerService.tsx";
import {getTripRequestById} from "../../services/tripRequestService.ts";
import {TripRequest} from "../../interfaces/TripRequest.ts";

function TripDetailPage() {
    const navigate = useNavigate();

    const {id, type} = useParams();


    let tripId: number;
    let tripType: string;
    if (id && type) {
        tripId = Number(id);
        tripType = type;
    } else {
        navigate('/404');
    }

    const [trip, setTrip] = useState<Offer|TripRequest|undefined>();

    useEffect(() => {
        if(tripType === "offer") {
            (async () => {
                const offer = await getOfferById(tripId);
                setTrip(offer);
                if(!offer) {
                    navigate("/404")
                }
            })()
        }
        if(tripType === "request") {
            (async () => {
                const tripRequest = await getTripRequestById(tripId);
                setTrip(tripRequest);
                if(!tripRequest) {
                    navigate("/404")
                }
            })()
        }
        if(tripType !== "request" && tripType !== "offer") {
           navigate("/404")
        }

    }, []);


    return (
        <Container fluid="md">
            {!trip ?
                <p >Wähle ein Gültiges Offer aus</p>
                :
                <Row className="d-flex justify-content-center">
                    <Col md={8} className="d-flex justify-content-center justify-content-xl-end">
                        <DetailComponent trip={trip}/>
                    </Col>
                    <Col md={3} className="d-flex justify-content-center justify-content-xl-start">
                        <DetailSidebar trip={trip}/>
                    </Col>
                </Row>
            }
        </Container>
    )
}

export default TripDetailPage