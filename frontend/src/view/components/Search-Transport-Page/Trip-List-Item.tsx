import { Link } from "react-router-dom";
import { Card, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { Offer } from "../../../interfaces/Offer.ts";
import { TripRequest } from "../../../interfaces/TripRequest.ts";
import { useEffect, useState } from "react";
import placeholderCar from "../../../assets/img/placeholder_car.png";
import placeholderBox from "../../../assets/img/placeholder_box.jpg";

function TripListItem(props: { trip: Offer | TripRequest }) {
  const [plzDisplay, setPlzDisplay] = useState({ plz1: "Start", plz2: "End" });
  const [ImgSrc, setImgSrc] = useState<string>(placeholderCar);

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
    setImage();
  }, [props.trip]);


  const convertDateTimeForDisplay = () => {
    const date = new Date(props.trip.startDate);
    return date.toLocaleString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getStateDisplay= () =>{
    var state = 'none';
    if('state' in props.trip){
      switch (props.trip.state){
        case 0: state="request";
        break;
        case 1: state = "offer";
        break;
        case 2: state = "booked";
        break;
        case 3: state = "intransit";
        break;
        case 4: state = "finished";
        break;}
    }
    return (<span className="badge bg-secondary">{state}</span>);
  }
  const setImage = () => {
    const { trip } = props;
  
    if ("route" in trip) {
      if (trip.vehicle?.picture?.length) {
        setImgSrc(`${window.location.protocol}//${window.location.host}/vehicle/vehicle-image/${trip.vehicle.picture}`);
        return;
      }
      setImgSrc(placeholderCar);
    } else if ("cargoImg" in trip) {
      if (trip.cargoImg) {
        setImgSrc(`${window.location.protocol}//${window.location.host}/request/cargo-image/${trip.cargoImg}`);
        return;
      }
      setImgSrc(placeholderBox);
    }
  };

  return (
    <div className="mb-4">
      <Link
        to={"route" in props.trip ? `/trip/offer/${props.trip.id}` : `/trip/request/${props.trip.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card key={props.trip.id}>
          <div className="d-flex">
            <Image
              style={{
                width: "220px",
                height: "220px",
                objectFit: "cover",
                overflow: "hidden",
                borderRadius: "0.2rem 0 0 0.2rem"
              }}
              src={ImgSrc}
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
                <p>{getStateDisplay()}</p>
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
