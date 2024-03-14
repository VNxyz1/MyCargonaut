import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import placeholderImg from "../../../assets/img/platzhalter_auto.jpg";
import {deleteVehicle, getOwnVehicles} from "../../../services/vehicleService";
import {Vehicle, VehicleTypes} from "../../../interfaces/Vehicle";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import VehicleEditModalComponent from "./VehicleEditModalComponent.tsx";

function MyVehiclesComponent() {
    const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
    const [showDeleteVehicleModal, setShowDeleteVehicleModal] = useState(false);
    const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

    /*-----Get-----*/
    useEffect(() => {
        fetchVehicle();
    }, []);

    const fetchVehicle = async () => {
        try {
            const data = await getOwnVehicles();
            if (data !== null) {
                setVehicleData(data);
            }
        } catch (error) {
            console.error("Error fetching vehicle data", error);
        }
    };

    /*-----Delete-----*/
    const handleShowDeleteVehicleModal = (vehicleId: number) => {
        setSelectedVehicleId(vehicleId);
        setShowDeleteVehicleModal(true);
    };

    const handleCloseDeleteVehicleModal = () => {
        setSelectedVehicleId(null);
        setShowDeleteVehicleModal(false);
    };

    /*-----Edit-----*/
    const handleShowEditVehicleModal = (vehicleId: number) => {
        setSelectedVehicleId(vehicleId);
        setShowEditVehicleModal(true);
    };

    const handleCloseEditVehicleModal = async () => {
        await fetchVehicle();
        setSelectedVehicleId(null);
        setShowEditVehicleModal(false);
    };

    const handleConfirmDeleteVehicle = async () => {
        if (selectedVehicleId !== null) {
            const isDeleted = await deleteVehicle(selectedVehicleId);
            if (isDeleted) {
                await fetchVehicle();
                handleCloseDeleteVehicleModal();
            } else {
                console.log("Fehler beim Löschen des Fahrzeugs");
            }
            setSelectedVehicleId(null);
        } else {
            console.log("Kein Fahrzeug ausgewählt");
        }
    };

    return (
        <Container>
            <Modal show={showDeleteVehicleModal} onHide={handleCloseDeleteVehicleModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profil löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Möchten du das Fahrzeug löschen?</p>
                    <p>Stelle sicher, dass es in keiner Anzeige verwendet wird.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleConfirmDeleteVehicle}> Fahrzeug löschen </Button>
                    <Button variant="secondary" onClick={handleCloseDeleteVehicleModal}> Abbrechen </Button>
                </Modal.Footer>
            </Modal>
            <VehicleEditModalComponent show={showEditVehicleModal} onHide={handleCloseEditVehicleModal} vehicle={vehicleData.find((vehicle) => vehicle.id === selectedVehicleId)} onEdit={fetchVehicle}/>

            {vehicleData.length === 0 ? (
                <p>Du hast noch keine Fahrzeuge angelegt.</p>
            ) : (
                <div className="vehicleCard-container">
                    {vehicleData.map(vehicle => (
                        <Card key={vehicle.id} className="vehicle-card">
                            <Card.Img
                                variant="top"
                                src={vehicle.picture ? `${window.location.protocol}//${window.location.host}/vehicle/vehicle-image/${vehicle.picture}` : placeholderImg}
                                alt={`Bild von kann nicht angezeigt werden`}
                            />
                            <Card.Body>
                                <Card.Text style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                                    <Card.Title>{vehicle.name}</Card.Title>
                                    <span style={{ display: 'flex', gap: '30px' }}>
                                        <span className="vehicleCard-btn" onClick={() => handleShowDeleteVehicleModal(vehicle.id)}><i className="icon-trash"></i> Löschen</span>
                                        <span className="vehicleCard-btn" onClick={() => {
                                            handleShowEditVehicleModal(vehicle.id);
                                        }}><i className="icon-pen-to-square"></i> Bearbeiten</span>
                                    </span>
                                </Card.Text>
                                <Card.Text style={{ display: 'flex', gap: '30px' }}>
                                    <div>
                                        <p className="prof-lable">Sitze</p>
                                        <p>{vehicle.seats}</p>
                                    </div>
                                    <div>
                                        <p className="prof-lable">Typ</p>
                                        <p>{VehicleTypes[vehicle.type]}</p>
                                    </div>
                                </Card.Text>
                                <Card.Text>
                                    <p className="prof-lable">Beschreibung</p>
                                    <p>{vehicle.description}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
}

export default MyVehiclesComponent;
