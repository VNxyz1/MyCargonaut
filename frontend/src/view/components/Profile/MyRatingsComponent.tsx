import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

function MyRatingsComponent() {
    return (

            <Container>
                <p>Du hast noch keine Bewertungen erhalten.</p>

                <Card>
                    <Card.Body>
                        <Card.Title>Name</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Datum</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">Sterne</Card.Subtitle>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>


            </Container>

);
}

export default MyRatingsComponent;

