import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Offer} from "../../interfaces/Offer.ts";
import DetailComponent from "../components/Trip-Detail/Detail-Component.tsx";
import {Col, Container, Row} from "react-bootstrap";
import DetailSidebar from "../components/Trip-Detail/Trip-Detail-Sidebar.tsx";

function TripDetailPage(
    props: {
        offers: Offer[]
    }
) {
    const navigate = useNavigate();

    const {id} = useParams();
    let offerId: number;
    if (id) {
        offerId = Number(id);
    } else {
        navigate('/');
    }

    const [offer, setOffer] = useState<Offer>({
        bookedSeats: 0,
        clients: [],
        createdAt: new Date(),
        description: "",
        id: 0,
        provider: {
            id: 0,
            firstName: "",
            lastName: "",
            profilePicture: "",
            description: "",
        },
        route: [],
        startDate: new Date(),
        state: 0,
        transitRequests: [],
        vehicle: ""
    });

    useEffect(() => {
        const offer = props.offers.find((o) => o.id === offerId);
        if (offer) {
            setOffer(offer);
        }
    }, [props.offers]);


    return (
        <Container fluid="lg">
            <Row>
                <Col md={7} xxl={8} className="d-flex justify-content-center justify-content-xl-end">
                    <DetailComponent offer={offer}/>
                </Col>
                <Col xxl={"auto"} className="d-flex justify-content-center justify-content-xl-start">
                    <DetailSidebar offer={offer}/>
                </Col>
            </Row>
        </Container>
    )
}

export default TripDetailPage
