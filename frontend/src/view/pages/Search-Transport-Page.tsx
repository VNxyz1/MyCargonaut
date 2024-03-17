import React, { useEffect, useState } from 'react';
import { Container, Row, Card } from "react-bootstrap";
import { Offer } from "../../interfaces/Offer.ts";
import { TripRequest } from "../../interfaces/TripRequest.ts";
import Button from "react-bootstrap/Button";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import TripListItem from "../components/Search-Transport-Page/Trip-List-Item.tsx";
import { useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';


function SearchTransportPage(
    props: {
        offers: Offer[]
        requests: TripRequest[]
        reRender: () => void
    }
) {
    const location = useLocation();
    const [urlParams, setUrlParams] = useState(new URLSearchParams(location.search));
    const [dataArray, setDataArray] = useState<(Offer | TripRequest)[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [vonInput, setVonInput] = useState<string>('');
    const [nachInput, setNachInput] = useState<string>('');
    const [anzahlSitzeInput, setAnzahlSitzeInput] = useState<string>('');
    const [datumInput, setDatumInput] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);

    useEffect(() => {
        setUrlParams(new URLSearchParams(location.search));
        clearAllFilters();
    }, [location.search]);

    useEffect(() => {
        setInitialDataBasedOnUrlParams();
    }, [urlParams]);

    useEffect(() => {
        setInitialDataBasedOnUrlParams();
    }, [props.offers, props.requests]);

    const setInitialDataBasedOnUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tripType = urlParams.get('t');

        if (tripType === 'offer') {
            setSelectedType('offer');
            setDataArray(props.offers);
        } else if (tripType === 'request') {
            setSelectedType('request');
            setDataArray(props.requests);
        } else {
            console.error('Ungültiger Angebotstyp');
            return;
        }
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleVonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVonInput(event.target.value);
    };

    const handleNachInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNachInput(event.target.value);
    };

    const handleAnzahlSitzeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnzahlSitzeInput(event.target.value);
    };

    const handleDatumInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDatumInput(event.target.value);
    };

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const searchParams: string[] = [];

            // Suchbegriff hinzufügen
            if (searchInput.trim() !== '') {
                searchParams.push(`searchString=${encodeURIComponent(searchInput.trim())}`);
            }

            // Von und nach PLZ hinzufügen
            if (vonInput.trim() !== '') {
                searchParams.push(`fromPLZ=${encodeURIComponent(vonInput.trim())}`);
            }
            if (nachInput.trim() !== '') {
                searchParams.push(`toPLZ=${encodeURIComponent(nachInput.trim())}`);
            }

            // Bewertung hinzufügen
            if (rating !== 0) {
                searchParams.push(`rating=${rating}`);
            }

            // Datum hinzufügen
            if (datumInput.trim() !== '') {
                searchParams.push(`date=${encodeURIComponent(datumInput.trim())}`);
            }

            // Anzahl Sitze hinzufügen
            if (anzahlSitzeInput !== '') {
                searchParams.push(`seats=${anzahlSitzeInput}`);
            }

            let url;
            if (selectedType === 'offer') {
                url = `/offer/search?${searchParams.join('&')}`;
            } else if (selectedType === 'request') {
                url = `/request/search?${searchParams.join('&')}`;
            } else {
                console.error('Ungültiger Angebotstyp');
                return;
            }
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (selectedType === 'offer') {
                    setDataArray(data.offerList);
                } else if (selectedType === 'request') {
                    setDataArray(data.tripRequests);
                }
            } else {
                console.error('Anfrage fehlgeschlagen');
            }
        } catch (error) {
            console.error('Fehler bei der Anfrage');
        }
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const radioValue = event.target.value;
        setSelectedType(radioValue);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('t', radioValue);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        clearAllFilters();
    };

    const handleClick = (ratingValue: number) => {
        setRating(ratingValue);
    };

    const handleMouseEnter = (ratingValue: number) => {
        setHover(ratingValue);
    };

    const clearAllFilters = () => {
        setSearchInput('');
        setVonInput('');
        setNachInput('');
        setAnzahlSitzeInput('');
        setDatumInput('');
        setRating(0);
        setHover(0);
        setInitialDataBasedOnUrlParams();
    };

    useEffect(() => {
        props.reRender()
    }, []);

    return (
        <>
            <Container className="content-container">
                <Row>
                    <Form onSubmit={search} className="col-sm-3 mb-3" id="search-sidebar">
                        <Card>
                            <Card.Body>
                                <p>Angebotstyp</p>
                                <div>
                                    <span>
                                        <Form.Check
                                            type="radio"
                                            value="offer"
                                            label='Angebot'
                                            checked={selectedType === 'offer'}
                                            onChange={handleRadioChange}
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <Form.Check
                                            type="radio"
                                            value="request"
                                            label='Gesuch'
                                            checked={selectedType === 'request'}
                                            onChange={handleRadioChange}
                                        />
                                    </span>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <p>Filter optionen:</p>
                                <span>
                                    Postleitzahl:
                                </span>
                                <div className="d-flex flex-row align-items-center">
                                    <Form.Control className='w-50' type="text" placeholder="Von" id="vonInput" value={vonInput} onChange={handleVonInputChange}/>
                                    <FontAwesomeIcon className="px-2 pt-1" icon={faArrowRight} />
                                    <Form.Control className='w-50' type="text" placeholder="Nach" id="nachInput" value={nachInput} onChange={handleNachInputChange}/>
                                </div>
                                <hr/>
                                <div>
                                    <span>
                                        Anzahl Sitze:
                                    </span>
                                    <Form.Control className='w-100' type="number" id="anzahlSitzeInput" value={anzahlSitzeInput} onChange={handleAnzahlSitzeInputChange}/>
                                </div>
                                <hr/>
                                <div>
                                    <span>
                                        Datum:
                                    </span>
                                    <Form.Control className='w-100' type="date" id="datumInput" value={datumInput} onChange={handleDatumInputChange}/>
                                </div>
                                <hr/>
                                <div>
                                    <span>
                                        Bewertung des Benutzers:
                                    </span>
                                    <div className='d-flex justify-content-center'>
                                        {[...Array(5)].map((_star, index) => {
                                            const ratingValue = index + 1;
                                            const starClass = ratingValue <= (hover || rating) ? `star-active` : 'star';

                                            return (
                                                <label key={index}>
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value={ratingValue}
                                                        onClick={() => handleClick(ratingValue)}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className={starClass}
                                                        size="1x"
                                                        onMouseEnter={() => handleMouseEnter(ratingValue)}
                                                        onMouseLeave={() => setHover(0)}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card.Body>
                            <Button id='NoBorderButton'  className="mainButton bg-danger w-100" onClick={clearAllFilters}>
                                Filter zurücksetzen
                            </Button>
                            <Button type='submit' id='borderButton' className="mainButton w-100 mb-2">
                                Filter anwenden
                            </Button>
                        </Card>
                    </Form>
                    <Form onSubmit={search} className="col-sm-9">
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
                                    type="submit"
                                >
                                    Suchen
                                </button>
                            </div>
                        </div>
                        {dataArray.map((item) => (
                            <TripListItem trip={item}></TripListItem>
                        ))}
                    </Form>
                </Row>
            </Container>
        </>
    );
}

export default SearchTransportPage;
