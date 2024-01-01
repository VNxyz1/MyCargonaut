import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Offer} from "../../interfaces/Offer.ts";
import DetailComponent from "../components/Trip-Detail/Detail-Component.tsx";

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
        <>
            <DetailComponent offer={offer}/>
        </>
    )
}

export default TripDetailPage
