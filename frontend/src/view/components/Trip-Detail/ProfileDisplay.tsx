import {UserLight} from "../../../interfaces/UserLight.ts";
import {Col, Row} from "react-bootstrap";
import placeholderImg from "../../../assets/img/user-default-placeholder.png";
import {useEffect, useState} from "react";
import {User} from "../../../interfaces/User.ts";
import { Link } from "react-router-dom";

function ProfileDisplay(
    props: {
        user: UserLight | User
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
                
                <Link
        to={"id" in props.user ? `/user/${props.user.id}` : `/404}`}
        style={{ textDecoration: "none", color: "inherit" }}
                >
                <Col xs={"auto"}>
                    <img src={props.user.profilePicture ?
                      `${window.location.protocol}//${window.location.host}/user/profile-image/${props.user.profilePicture}` :
                        placeholderImg}
                         style={{height: "60px", width: "60px", objectFit: "cover", borderRadius: "50px"}}
                         alt="Profilbild"/>
                </Col>
                <Col>
                
                    <h5>{props.user.firstName} {props.user.lastName}</h5>
                    Mitglied seit {entryDateDisplay}
                </Col>
                </Link>
            </Row>
        </>
    )
}

export default ProfileDisplay