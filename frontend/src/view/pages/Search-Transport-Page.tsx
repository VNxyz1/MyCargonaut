import { useState } from 'react';
import { Container, Row, Card, Image } from "react-bootstrap";
import img from "../../assets/img/home_transport.png"
import Button from "react-bootstrap/Button";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Product {
    id: number;
    from: string;
    to: string;
    date: string;
    price: number;
    description: string;
    categories: string[];
  }

const exampleData: Product[] = [
    {
      id: 1,
      from: "10115 Berlin",
      to: "20095 Hamburg",
      date: "15.01.2023",
      price: 80.50,
      description: "Fahrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine anhrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die malerihrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die malerihrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die malerigenehme Reise durch die malerischen Straßen.",
      categories: ["Nichtraucher", "Pünklich"]
    },
    {
      id: 2,
      from: "80331 München",
      to: "60313 Frankfurt",
      date: "10.02.2023",
      price: 120.75,
      description: "Autofahrt von München (PLZ 80331) nach Frankfurt (PLZ 60313). Erleben Sie eine entspannte Fahrt durch die bayerischen Alpen.",
      categories: ["Cargo"]
    },
    {
      id: 3,
      from: "40210 Düsseldorf",
      to: "50667 Köln",
      date: "05.03.2023",
      price: 45.99,
      description: "Kurze Strecke von Düsseldorf (PLZ 40210) nach Köln (PLZ 50667). Eine schnelle und bequeme Reise zwischen den beiden lebendigen Städten Nordrhein-Westfalens.",
      categories: ["Nichtraucher", "Pünklich", "Cargo"]
    },
    {
      id: 4,
      from: "70173 Stuttgart",
      to: "90402 Nürnberg",
      date: "20.04.2023",
      price: 60.25,
      description: "Autoreise von Stuttgart (PLZ 70173) nach Nürnberg (PLZ 90402). Erkunden Sie die wunderschöne Region zwischen Baden-Württemberg und Bayern auf dieserhrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die malerihrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die malerihrt von Berlin (PLZ 10115) nach Hamburg (PLZ 20095). Eine angenehme Reise durch die maleri angenehmen Fahrt.",
      categories: ["Pünklich"]
    },
    {
      id: 5,
      from: "30159 Hannover",
      to: "28195 Bremen",
      date: "15.05.2023",
      price: 55.99,
      description: "Fahrt von Hannover (PLZ 30159) nach Bremen (PLZ 28195). Eine gemütliche Reise durch das norddeutsche Flachland, vorbei an grünen Feldern und charmanten Dörfern.",
      categories: ["Pünklich", "Stauraum", "Sparsam"]
    }
  ];

function SearchTransportPage() {
    const [filteredData, setFilteredData] = useState<Product[]>(exampleData);

    const [selectedFilters, setSelectedFilters] = useState({
        transport: false,
        cargo: false,
        angebote: false,
        gesuche: false,
        berlin: false,
    });

    // Function to handle filter changes
    const handleFilterChange = (filterType: keyof typeof selectedFilters) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: !prevFilters[filterType],
        }));
    };

    // Function to handle applying filters
    const applyFilters = () => {
        // Logic to filter data based on selected filters
        const filteredData = exampleData.filter((item) => {
        if (
            (selectedFilters.transport && !item.categories.includes('Transport')) ||
            (selectedFilters.cargo && !item.categories.includes('Cargo')) ||
            (selectedFilters.gesuche && item.categories.includes('Gesuche')) ||
            (selectedFilters.angebote && item.categories.includes('Angebote')) ||
            (selectedFilters.berlin && !item.from.includes('Berlin'))
        ) {
            return false;
        }
        return true;
        });

        setFilteredData(filteredData);
    };

    return (
        <>
            <Container className="mt-5 mb-5">
                <Row>
                    <div className="col-sm-3">
                        <Card>
                            <Card.Footer>
                                <h3>Kategorie</h3>
                            </Card.Footer>
                            <Card.Body>
                                <div>
                                    <span>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.transport}
                                            onChange={() => handleFilterChange("transport")}
                                        />
                                        <small>Transport</small>
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.cargo}
                                            onChange={() => handleFilterChange("cargo")}
                                        />
                                        <small>Cargo</small>
                                    </span>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <h3>Angebotstyp</h3>
                            </Card.Footer>
                            <Card.Body>
                                <div>
                                    <span>
                                        <input 
                                            type="checkbox"
                                            checked={selectedFilters.angebote}
                                            onChange={() => handleFilterChange("angebote")}
                                        />
                                        <small>Angebote (4)</small>
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <input 
                                            type="checkbox"
                                            checked={selectedFilters.gesuche}
                                            onChange={() => handleFilterChange("gesuche")}
                                        />
                                        <small>Gesuche (4)</small>
                                    </span>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <h3>Ort</h3>
                            </Card.Footer>
                            <Card.Body>
                                <span>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.berlin}
                                        onChange={() => handleFilterChange("berlin")}
                                    />
                                    <small>Berlin</small>
                                </span>
                            </Card.Body>
                            <Card.Footer>
                                <Button className="mainButton w-100 mb-2" onClick={applyFilters}>
                                    Filter anwenden
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                    <div className="col-sm-9">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Suche..." aria-label="Suchen" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button">Suchen</button>
                            </div>
                        </div>
                        {filteredData.map((item: Product) => (
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
                                                    <h5><strong>{item.from}</strong></h5>
                                                    <FontAwesomeIcon className="px-2 pt-1" icon={faArrowRight}/>
                                                    <h5><strong>{item.to}</strong></h5>
                                                </div>
                                                <p>{item.date}</p>
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

