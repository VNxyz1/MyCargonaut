import React, { useState } from 'react';
import { Row, Toast } from 'react-bootstrap';

interface AlertComponentProps {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
    onClose?: () => void;
}

function AlertComponent({ message, type, show: externalShow, onClose }: AlertComponentProps) {
    const [show, setShow] = useState(false);

    React.useEffect(() => {
        setShow(externalShow);
    }, [externalShow]);

    const handleClose = () => {
        setShow(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Row className={`alertContainer ${type}-alert`}>
            <Toast onClose={handleClose} show={show} delay={4000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{type.charAt(0).toUpperCase() + type.slice(1)} Message</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </Row>
    );
}

export default AlertComponent;
