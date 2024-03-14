import { useEffect, useState } from 'react';
import { Container, Row, Card } from "react-bootstrap";
import {Offer} from "../../interfaces/Offer.ts";
import Button from "react-bootstrap/Button";
import TripListItem from "../components/Search-Transport-Page/Trip-List-Item.tsx";


function SearchTransportPage(
    props: {
        offers: Offer[]
        reRender: ()=> void
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
                console.log(data.offerList)
                setOffers(data.offerList);
                console.error(data.offerList);
            } else {
                console.error('Anfrage fehlgeschlagen');
            }
        } catch (error) {
            console.error('Fehler bei der Anfrage');
        }
    };

    useEffect(() => {
        setOffers(props.offers)
    }, [props.offers]);

    useEffect(() => {
        props.reRender()
    }, []);

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
                            <TripListItem trip={item}/>
                        ))}
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default SearchTransportPage;

