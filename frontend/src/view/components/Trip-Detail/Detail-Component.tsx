import {Offer} from "../../../interfaces/Offer.ts";
import {Image} from "react-bootstrap";
import placeholderImg from "../../../assets/img/placeholder_car.png";
import Card from "react-bootstrap/Card";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {TripRequest} from "../../../interfaces/TripRequest.ts";
import {RoutePart} from "../../../interfaces/RoutePart.ts";
import ProfileDisplay from "./ProfileDisplay.tsx";
import {User} from "../../../interfaces/User";
import { useAuth } from "../../../services/authService.tsx";
import { getClients } from "../../../services/offerService.tsx";
import {getLoggedInUser} from "../../../services/userService.tsx";

interface RouteDisplay {
    plz: string,
    location: string
}

function DetailComponent(
    props: {
        trip: Offer|TripRequest
    }
) {

    const [plzDisplay, setPlzDisplay] = useState({plz1: "Start", plz2: "End"});
    const [dateTimeDisplay, setDateTimeDisplay] = useState("");
    const [imageUrl, setImageUrl] = useState<string|undefined>();
    const [imageAltText, setImageAltText] = useState<string>("placeholder");
    const [routeDisplays, setRouteDisplays] = useState<RouteDisplay[]>([]);
    
    const {isAuthenticated} = useAuth();
    const [clientsUserData, setClientsUserData] = useState<User[]>([]);

    const createRouteDisplayArr = (routeParts: RoutePart[]):RouteDisplay[] => {
        return routeParts.map((rP)=> convertRoutePartToPlzDisplay(rP));
    }

    const userIsTripOwner = () => {
        let ownerId: number = -1;
        let loggedInUserId: number | undefined;

        if ("provider" in props.trip) {
            ownerId = props.trip.provider.id
        } else if ("requester" in props.trip) {
            ownerId = props.trip.requester.id
        }

        getLoggedInUser().then(value => loggedInUserId = value?.id)

        return loggedInUserId && loggedInUserId === ownerId;
    }

    const fetchClientUsers = async () => {
        const data = await getClients(props.trip.id);
        if (data !== null) {
            setClientsUserData(data as any);
        }
    };
    const convertRoutePartToPlzDisplay = (routePart: RoutePart): RouteDisplay => {
        const plz = routePart.plz.plz;
        const location = routePart.plz.location;
        return {plz, location}
    }

    const sortRouteParts = (routeParts: RoutePart[]): RoutePart[] => {
        return routeParts.sort((a, b) => {
            return a.position - b.position;
        });
    }

    const setPlzForDisplay = () => {
        setPlzForOffer();
        setPlzForTripRequest();
    }

    const setPlzForOffer = () => {
        if("route" in props.trip) {
            const route = props.trip.route;
            if (route.length !== 0) {
                const plz1 = route[0].plz.plz + " " + route[0].plz.location;
                const plz2 = route[props.trip.route.length - 1].plz.plz + " " + route[props.trip.route.length - 1].plz.location;
                setPlzDisplay({
                    plz1,
                    plz2
                });
            }
        }
    }

    const setPlzForTripRequest = () => {
        if("startPlz" in props.trip) {
            const plz1 = props.trip.startPlz.plz + "" + props.trip.startPlz.location;
            const plz2 = props.trip.endPlz.plz + "" + props.trip.endPlz.location;
                setPlzDisplay({
                    plz1,
                    plz2
                });
        }
    }

    const convertDateTimeForDisplay = () => {
        const date = new Date(props.trip.startDate);

        return date.toLocaleString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false
        })
    }

    const setImage = () => {
        if("startPlz" in props.trip) {
            if(props.trip.cargoImg) {
                setImageUrl(`${window.location.protocol}//${window.location.host}/request/cargo-image/${props.trip.cargoImg}`);
            } else {
                setImageUrl(undefined);
            }
        }
        if("route" in props.trip) {
            if(props.trip.vehicle.picture) {
                setImageUrl(`${window.location.protocol}//${window.location.host}/vehicle/vehicle-image/${props.trip.vehicle.picture}`);
            } else {
                setImageUrl(undefined);
            }
        }
    }

    useEffect(() => {
        setPlzForDisplay();
        const date = convertDateTimeForDisplay()
        setDateTimeDisplay(date);
        setImage();
        if("route" in props.trip){
            const rPArr = sortRouteParts(props.trip.route);
            const rDArr = createRouteDisplayArr(rPArr);
            setRouteDisplays(rDArr);
        }
    }, [props.trip]);

    useEffect(() => {
        if(!imageUrl) {
            setImageAltText("placeholder image");
        } else {
            if(imageUrl.includes("cargo-image")) {
                setImageAltText("cargo image");
            } else {
                setImageAltText("vehicle image");
            }
        }


    }, [imageUrl]);
    useEffect(() => {
        if (isAuthenticated && userIsTripOwner()) {
            fetchClientUsers();
        } 
    }, []);
    

    return (
        <div className="mt-4" style={{ width: "100%" }} >
            <div className="mb-3" style={{overflow: "hidden", height: "26rem", borderRadius: "0.5rem"}}>
                <Image src={imageUrl ? imageUrl : placeholderImg} alt={imageAltText}
                       style={{width: "100%", height: "100%", objectFit: "cover"}}/>
            </div>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <h4>
                            <span>{plzDisplay.plz1}  </span>
                            <FontAwesomeIcon icon={faArrowRight}/>
                            <span>  {plzDisplay.plz2}</span>
                        </h4>
                    </Card.Title>
                    <Card.Text>
                        <b>Start:</b> {dateTimeDisplay}
                    </Card.Text>
                    {"route" in props.trip ?
                        <>
                            <Card.Title>
                                <h4>Komplette Route:</h4>
                            </Card.Title>
                            <Card.Title>
                                {routeDisplays.map((rD, index)=> (
                                    <>
                                        <span>  {rD.plz} {rD.location}  </span>
                                        { index === routeDisplays.length -1 ?
                                            <></>
                                            :
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                        }
                                    </>
                                ))}
                            </Card.Title>
                        </>
                        :
                        <></>
                    }
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Beschreibung</Card.Title>
                    <Card.Text>
                        {props.trip.description}
                    </Card.Text>
                </Card.Body>
            </Card>
            { clientsUserData.length === 0 ? " ":
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Mitfahrer</Card.Title>
                    <Card.Text>
                        {clientsUserData.map(user => {
                                return (
                                    <ProfileDisplay  user={user!}/>
                                )
                            }
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>}

        </div>
    )
}

export default DetailComponent
