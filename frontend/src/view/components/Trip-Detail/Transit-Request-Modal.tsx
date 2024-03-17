import {Modal, ModalProps} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {TransitRequest} from "../../../interfaces/TransitRequest.ts";
import React, {useState} from "react";
import Form from "react-bootstrap/Form";

interface TransitRequestModalProps extends ModalProps {
    onClose: () => void;
    offerId: number;
}

function TransitRequestModal(props: TransitRequestModalProps) {

    const [validated, setValidated] = useState(false);
    const [data, setData] = useState<TransitRequest>({
        offeredCoins: 0,
        requestedSeats: 0,
        text: ""
    });
    const [feedback, setFeedback] = useState<string | undefined>(undefined);


    const sendTransitRequest = async () => {
        try {
            const res = await fetch(`/transit-request/${props.offerId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const data = await res.json();
                setFeedback(data.message);
            } else {
                setValidated(true);
                props.onClose();
            }
        } catch (e) {
            console.error(e)
        }

    }

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const prop = event.target.title;
        let value: string | number = event.target.value;
        if(prop === "offeredCoins" || prop === "requestedSeats") {
            value = Number(value)
        }
        setData({
            ...data,
            [prop]: value
        })
    }

    return (
        <>
            <Modal {...props} centered>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={sendTransitRequest}>
                        <Form.Group className="mb-3" controlId="transitModalForm.offeredCoins">
                            <Form.Control
                                required
                                type="number"
                                title="offeredCoins"
                                placeholder="Coins"
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="transitModalForm.requestedSeats">
                            <Form.Control
                                required
                                type="number"
                                title="requestedSeats"
                                placeholder="Sitz(e)"
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="transitModalForm.text">
                            <Form.Control
                                as="textarea" rows={4}
                                required
                                type="text"
                                title="text"
                                placeholder="Nachricht"
                                onChange={handleFormChange}
                                aria-describedby="textHelpBlock"
                            />
                            <Form.Text id="textHelpBlock" muted>
                                Was hast du noch an Cargo dabei? Bis wo hin willst du mit?
                            </Form.Text>
                        </Form.Group>
                        {!feedback ?
                            <></>
                            :
                            <div>
                                <Form.Text style={{color: 'red'}}>
                                    {feedback}
                                </Form.Text>
                            </div>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Abbrechen
                    </Button>
                    <Button className="mainButton" type="submit" onClick={sendTransitRequest}>
                        Angebot machen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TransitRequestModal