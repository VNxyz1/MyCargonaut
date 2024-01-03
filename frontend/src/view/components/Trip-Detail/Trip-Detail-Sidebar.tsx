import {Offer} from "../../../interfaces/Offer.ts";
import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import ProfileDisplay from "./ProfileDisplay.tsx";
import TransitRequestModal from "./Transit-Request-Modal.tsx";


function DetailSidebar(
    props: {
        offer: Offer
    }
) {
    const [showTransitRequestModal, setShowTransitRequestModal] = useState(false);



    useEffect(() => {

    }, []);


    const handleOpen = () => setShowTransitRequestModal(true);
    const handleClose = () => {
        setShowTransitRequestModal(false);
        console.log("closed")
    }


    return (
        <>
            <div className="mt-4" style={{width: "100%"}}>
                <Card>
                    <Card.Header>
                        <Button onClick={handleOpen} type="submit" className="mainButton w-100 mb-2">
                            Angebot machen
                        </Button>
                        <Button type="submit" className="mainButton w-100 mb-2">
                            Nachricht schreiben
                        </Button>
                        <Button type="submit" className="mainButton w-100 mb-2">
                            Zur Merkliste hinzufügen
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <ProfileDisplay user={props.offer.provider}/>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                        <span>Anzeigen-ID</span>
                        <span>{props.offer.id}</span>
                    </Card.Footer>
                </Card>

            </div>
            <TransitRequestModal show={showTransitRequestModal} onClose={handleClose} offerId={props.offer.id}/>
        </>

    )
}

export default DetailSidebar
