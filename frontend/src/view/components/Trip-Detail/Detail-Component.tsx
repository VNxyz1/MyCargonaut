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

    const [plzDisplay, setPlzDisplay] = useState({plz1: "", plz2: ""})

    const setPlzForDisplay = () => {
            const route = props.offer.route;
            if(route.length !== 0) {
                const plz1 = route[0].plz.plz;
                const plz2 = route[props.offer.route.length-1].plz.plz;
                setPlzDisplay({
                    plz1,
                    plz2
                });
            }
    }

    useEffect(() => {
            setPlzForDisplay()
    }, [props.offer]);



    return (
        <>
            <div style={{overflow: "hidden", width:"32rem", height: "18rem"}}>
                <Image src={transporter} alt="placeholder img" style={{  width: "100%", height: "100%", objectFit: "cover"}}/>
            </div>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <span>{plzDisplay.plz1}</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                        <span>{plzDisplay.plz2}</span>
                    </Card.Title>
                    <Card.Text>
                        {props.offer.description}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Beschreibung</Card.Title>
                    <Card.Text>
                        {props.offer.description}
                    </Card.Text>
                </Card.Body>
            </Card>

        </>
    )
}

export default DetailComponent
