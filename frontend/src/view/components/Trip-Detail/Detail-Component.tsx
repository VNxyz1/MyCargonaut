import {Offer} from "../../../interfaces/Offer.ts";
import {Image} from "react-bootstrap";
import transporter from "../../../assets/img/home_transport.png";
import Card from "react-bootstrap/Card";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";


function DetailComponent(
    props: {
        offer: Offer
    }
) {

    const [plzDisplay, setPlzDisplay] = useState({plz1: "", plz2: ""});
    const [dateTimeDisplay, setDateTimeDisplay] = useState("");


    const setPlzForDisplay = () => {
        const route = props.offer.route;
        if (route.length !== 0) {
            const plz1 = route[0].plz.plz + " " + route[0].plz.location;
            const plz2 = route[props.offer.route.length - 1].plz.plz + " " + route[props.offer.route.length - 1].plz.location;
            setPlzDisplay({
                plz1,
                plz2
            });
        }
    }

    const convertDateTimeForDisplay = () => {
        const date = new Date(props.offer.createdAt);

        return date.toLocaleString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false
        })
    }

    useEffect(() => {
        setPlzForDisplay();
        const date = convertDateTimeForDisplay()
        setDateTimeDisplay(date);
    }, [props.offer]);


    return (
        <div className="mt-4" style={{ width: "100%" }} >
            <div className="mb-3" style={{overflow: "hidden", height: "22rem", borderRadius: "0.5rem"}}>
                <Image src={transporter} alt="placeholder img"
                       style={{width: "100%", height: "100%", objectFit: "cover"}}/>
            </div>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <span>{plzDisplay.plz1}  </span>
                        <FontAwesomeIcon icon={faArrowRight}/>
                        <span>  {plzDisplay.plz2}</span>
                    </Card.Title>
                    <Card.Text>
                        <b>Start:</b> {dateTimeDisplay}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Beschreibung</Card.Title>
                    <Card.Text>
                        {props.offer.description}
                    </Card.Text>
                </Card.Body>
            </Card>

        </div>
    )
}

export default DetailComponent
