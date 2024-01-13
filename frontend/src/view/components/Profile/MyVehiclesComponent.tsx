import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { Vehicle } from "../../../interfaces/Vehicle";
import placeholderImg from "../../../assets/img/platzhalter_auto.jpg";

const exampleData: Vehicle[] = [
    {
        id: 1,
        ownerId: 1,
        name: "Porsche Cayenne",
        vehiclePictureUrl: "",
        seats: 3,
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    },
    {
        id: 2,
        ownerId: 1,
        name: "Golf GTI",
        vehiclePictureUrl: "",
        seats: 3,
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    },
    {
        id: 3,
        ownerId: 1,
        name: "Porsche GT3 RS",
        vehiclePictureUrl: "",
        seats: 1,
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    },
];

function MyVehiclesComponent() {

    return (
        <Container>
            {exampleData.length === 0 ? (
                <p>Du hast noch keine Fahrzeuge angelegt.</p>
            ) : (
                <div className="card-container">
                    {exampleData.map(vehicle => (
                        <Card className="vehicle-card">
                            <img
                                src={vehicle.vehiclePictureUrl ? `${window.location.protocol}//${window.location.host}/user/profile-image/${vehicle.vehiclePictureUrl}` : placeholderImg}
                                alt="User profile image"
                            />
                            <Card.Body>
                                <Card.Text>
                                    <strong>Sitze:</strong> {vehicle.seats}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Beschreibung:</strong> {vehicle.description}
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
