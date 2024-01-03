import {Offer} from "../../../interfaces/Offer.ts";
import Card from "react-bootstrap/Card";
import {useEffect} from "react";
import Button from "react-bootstrap/Button";
import ProfileDisplay from "./ProfileDisplay.tsx";


function DetailSidebar(
    props: {
        offer: Offer
    }
) {

    //const [plzDisplay, setPlzDisplay] = useState({plz1: "", plz2: ""});
    //const [dateTimeDisplay, setDateTimeDisplay] = useState("");


    useEffect(() => {

    }, [props.offer]);


    return (
        <div className="mt-4" style={{width: "100%"}}>
            <Card>
                <Card.Header>
                    <Button type="submit" className="mainButton w-100 mb-2">
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
    )
}

export default DetailSidebar
