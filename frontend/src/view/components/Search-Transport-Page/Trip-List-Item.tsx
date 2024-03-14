import { Link } from "react-router-dom";
import { Card, Image } from "react-bootstrap";
import placeholderImg from "../../../assets/img/platzhalter_auto.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { Offer } from "../../../interfaces/Offer.ts";
import { useEffect, useState } from "react";

function TripListItem (
  props: {
    trip: Offer
  }
) {

  const [plzDisplay, setPlzDisplay] = useState({plz1: "Start", plz2: "End"});


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

  useEffect(() => {
    setPlzForOffer()
  }, []);

  const convertDateTimeForDisplay = () => {
    const date = new Date(props.trip.createdAt);

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


  return (
    <div className="mb-2" style={{height: "200px"}}>
      <Link to={`/trip/offer/${props.trip.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
        <Card key={props.trip.id}>
          <div className="d-flex">
            <Image
              style={{
                width: "300px",
                height: "200px",
                objectFit: "cover",
                overflow: "hidden",
                borderRadius: "0.2rem 0 0 0.2rem"
              }}
              src={props.trip.vehicle.picture ? `${window.location.protocol}//${window.location.host}/vehicle/vehicle-image/${props.trip.vehicle.picture}` : placeholderImg}
              alt=""
            />
            <div className="col">
              <Card.Header className="d-flex justify-content-between">
                <div className="d-flex">
                  <h5><strong>{plzDisplay.plz1}</strong></h5>
                  <FontAwesomeIcon className="px-2 pt-1" icon={faArrowRight}/>
                  <h5><strong>{plzDisplay.plz2}</strong></h5>
                </div>
                <p>{convertDateTimeForDisplay()}</p>
              </Card.Header>
              <Card.Body>
                {props.trip.description.length > 320
                  ? `${props.trip.description.slice(0, 320)}...`
                  : props.trip.description}
              </Card.Body>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default TripListItem