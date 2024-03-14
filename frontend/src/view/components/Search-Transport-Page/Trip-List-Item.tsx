import { Link } from "react-router-dom";
import { Card, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { Offer } from "../../../interfaces/Offer.ts";
import { TripRequest } from "../../../interfaces/TripRequest.ts";
import { useEffect, useState } from "react";
import platzhalter from "../../../assets/img/platzhalter_auto.jpg";

function TripListItem(props: { trip: Offer | TripRequest }) {
  const [plzDisplay, setPlzDisplay] = useState({ plz1: "Start", plz2: "End" });
  const [imgSrc, setImgSrc] = useState<string>(platzhalter);

  const setPlz = () => {
    if ("route" in props.trip) {
      const route = props.trip.route;
      if (route.length !== 0) {
        const plz1 = route[0].plz.plz + " " + route[0].plz.location;
        const plz2 =
          route[props.trip.route.length - 1].plz.plz +
          " " +
          route[props.trip.route.length - 1].plz.location;
        setPlzDisplay({
          plz1,
          plz2,
        });
      }
    } else {
      const plz1 = props.trip.startPlz.plz + " " + props.trip.startPlz.location;
      const plz2 = props.trip.endPlz.plz + " " + props.trip.endPlz.location;
      setPlzDisplay({
        plz1,
        plz2,
      });
    }
  };

  useEffect(() => {
    setPlz();
    // Check if there's a vehicle picture available
    if ("vehicle" in props.trip && props.trip.vehicle.picture) {
      setImgSrc(props.trip.vehicle.picture);
    } else if("cargoImg" in props.trip && props.trip.cargoImg != null) {
      setImgSrc(props.trip.cargoImg);
    }
  }, [props.trip]);

  const convertDateTimeForDisplay = () => {
    const date = new Date(props.trip.createdAt);
    return date.toLocaleString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mb-4">
      <Link
        to={"route" in props.trip ? `/offer/${props.trip.id}` : `/request/${props.trip.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card key={props.trip.id}>
          <div className="d-flex">
            <Image
              style={{
                objectFit: "cover",
                overflow: "hidden",
                borderRadius: "0.2rem 0 0 0.2rem"
              }}
              src={imgSrc}
            />
            <div className="col">
              <Card.Header>
                <div className="d-flex">
                  <h5>
                    <strong>{plzDisplay.plz1}</strong>
                  </h5>
                  <FontAwesomeIcon className="px-2 pt-1" icon={faArrowRight} />
                  <h5>
                    <strong>{plzDisplay.plz2}</strong>
                  </h5>
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

export default TripListItem;
