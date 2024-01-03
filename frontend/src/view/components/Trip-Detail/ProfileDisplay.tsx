import {UserLight} from "../../../interfaces/UserLight.ts";
import {Col, Row} from "react-bootstrap";
import placeholderImg from "../../../assets/img/user-default-placeholder.png";
import {useEffect, useState} from "react";

function ProfileDisplay(
    props: {
        user: UserLight
    }
) {

    const [entryDateDisplay, setEntryDateDisplay] = useState("");

    const convertEntryDateForDisplay = () => {
        const date = new Date(props.user.entryDate);

        return date.toLocaleString("de-DE", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        })
    }

    useEffect(() => {
        const date = convertEntryDateForDisplay()
        setEntryDateDisplay(date);
    }, [props.user]);

    return (
        <>
            <Row>
                <Col>
                    <img src={props.user.profilePicture ?
                        `http://localhost:3000/user/profile-image/${props.user.profilePicture}` :
                        placeholderImg}
                         style={{height: "100px", width: "100px", objectFit: "cover", borderRadius: "50px"}}
                         alt="Profilbild"/>
                </Col>
                <Col>
                    <h5>{props.user.firstName} {props.user.lastName}</h5>
                    Mitglied seit {entryDateDisplay}
                </Col>
            </Row>
        </>
    )
}

export default ProfileDisplay