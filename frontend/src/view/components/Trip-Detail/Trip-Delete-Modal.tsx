import {Modal, ModalProps} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect} from "react";
import { Offer } from "../../../interfaces/Offer";
import { deleteTrip } from "../../../services/offerService";
import { TripRequest } from "../../../interfaces/TripRequest";

interface TripDeleteModalProps extends ModalProps {
    trip: Offer|TripRequest;
    onClose: () => void;
}

function TripDeleteModal(props: TripDeleteModalProps) {

    useEffect(() => {

    }, []);
    const callDeleteTrip = () => {
        deleteTrip(props.trip.id);
    }
    return (
        <Modal
            {...props}
            centered
            backdrop="static"
        >
            <Modal.Header>
                <Modal.Title>Willst du den trip wirklich löschen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Hier mit wird der Trip unwieder ruflich gelöscht.
                Wollen sie vortfahren
            </Modal.Body>
            <Modal.Footer>
                <Button className="mainButton" onClick={callDeleteTrip} style={{backgroundColor: "var(--color-5)"}}>
                    LÖSCHEN
                </Button>
                <Button className="mainButton" onClick={props.onClose} style={{backgroundColor: "var(--color-5)"}}>
                    NICHT Löschen
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TripDeleteModal