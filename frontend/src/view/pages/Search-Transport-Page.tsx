import { useState } from 'react';
import { Container, Row, Card, Image } from "react-bootstrap";
import {Offer} from "../../interfaces/Offer.ts";
import img from "../../assets/img/home_transport.png"
import Button from "react-bootstrap/Button";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


function SearchTransportPage(
    props: {
        offers: Offer[]
    }
) {
    const [offers, setOffers] = useState<Offer[]>(props.offers);
    const [searchInput, setSearchInput] = useState<string>('');

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const searchOffers = async () => {
        try {
            const searchString = encodeURIComponent(searchInput);
            const url = `/offers/search?search=${searchString}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setOffers(data.offerList);
                console.error(data.offerList);
            } else {
                console.error('Anfrage fehlgeschlagen');
            }
        } catch (error) {
            console.error('Fehler bei der Anfrage');
        }
    };

    return (
        <>
            <Container className=" content-container">
                <Row>
                    <div className="col-sm-3" id="search-sidebar">
                        <Card>

                            <Card.Body>
                                <p>Kategorie</p>
                                <div>
                                    <span>
                                        <input
                                            type="checkbox"
                                        />
                                        <small>Transport</small>
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <input
                                            type="checkbox"
                                        />
                                        <small>Cargo</small>
                                    </span>
                                </div>
                            </Card.Body>

                            <Card.Body>
                                <p>Angebotstyp</p>
                                <div>
                                    <span>
                                        <input 
                                            type="checkbox"
                                        />
                                        <small>Angebote (4)</small>
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <input 
                                            type="checkbox"
                                        />
                                        <small>Gesuche (4)</small>
                                    </span>
                                </div>
                            </Card.Body>

                            <Card.Body>
                                <p>Ort</p>
                                <span>
                                    <input
                                        type="checkbox"
                                    />
                                    <small>Berlin</small>
                                </span>
                            </Card.Body>
                                <Button className="mainButton w-100 mb-2">
                                    Filter anwenden
                                </Button>
                        </Card>

                    </div>
                    <div className="col-sm-9">
                        <div className="input-group mb-3 searchBar">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Suche..."
                                aria-label="Suchen"
                                aria-describedby="basic-addon2"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={searchOffers}
                                >
                                    Suchen
                                </button>                            
                            </div>
                        </div>
                        {offers.map((item: Offer) => (
                            <div className="mb-2" style={{height: "200px"}}>
                                <Card key={item.id}>
                                    <div className="d-flex">
                                        <Image
                                            style={{ width: "300px", height: "200px", objectFit: "cover", overflow: "hidden", borderRadius: "0.2rem 0 0 0.2rem"}}
                                            src={img}
                                            alt=""
                                        />
                                        <div className="col">
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <h5><strong>{String(item.route[0].plz)}</strong></h5>
                                                    <FontAwesomeIcon className="px-2 pt-1" icon={faArrowRight}/>
                                                    <h5><strong>{String(item.route[item.route.length - 1].plz)}</strong></h5>
                                                </div>
                                                <p>{String(item.createdAt)}</p>
                                            </Card.Header>
                                            <Card.Body>
                                                {item.description.length > 320
                                                    ? `${item.description.slice(0, 320)}...`
                                                    : item.description}
                                            </Card.Body>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default SearchTransportPage;

