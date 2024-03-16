import { TripRequest } from "../interfaces/TripRequest.ts";
import { TripRequestOffering } from "../interfaces/TripRequestOffering.ts";

export const getTripRequestById = async (id: number) => {
  try {
    const res = await fetch(`/request/one/${id}`);
    if (res.ok) {
      const data: TripRequest = await res.json();
      return data;
    }
    const data = await res.json();
    console.error(data);
  } catch (e) {
    console.error(e)
  }
}

export const deleteOffering = async (id: number) => {
  try {
    const res = await fetch(`/request/offering/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return true;
    }
    const data = await res.json();
    console.error(data);
    return false;
  } catch (e) {
    console.error(e)
  }
}

export const postRequest = async (body: PostRequestBody) => {
  try {
    const formData = new FormData();
    formData.append('startPlz', JSON.stringify(body.startPlz));
    formData.append('endPlz', JSON.stringify(body.endPlz));
    formData.append('description', body.description);
    formData.append('startDate', body.startDate);
    formData.append('seats', body.seats.toString());

    if (body.cargoImg) {
      formData.append('cargoImg', body.cargoImg);
    }

    const response = await fetch(`/request`, {
      method: "POST",
      body: formData,
    });

    return response.ok;
  } catch (e) {
    console.error(e)
  }
}

export interface PostRequestBody {
  "startPlz": PostRequestPlz;
  "endPlz": PostRequestPlz;
  "cargoImg"?: File;
  "description": string;
  "startDate": string;
  "seats": number;
}

export interface PostRequestPlz {
  "plz": string;
  "location": string;
}


export const acceptOffering = async (id: number) => {
  try {
    const response = await fetch(`/request/offering/accept/${id}`, {
      method: "POST"
    });
    return response.ok;

  } catch (e) {
    console.error(e)
  }
}

export const declineOffering = async (id: number) => {
  try {
    const response = await fetch(`/request/offering/decline/${id}`, {
      method: "POST"
    });
    return response.ok;

  } catch (e) {
    console.error(e)
  }
}

export const getOfferings = async () => {

  let sentOfferings = await getOfferingsAsOfferingUser();
  let incomingOfferings = await getOfferingsAsRequestingUser();

  if (!sentOfferings) {
    sentOfferings = []
  }
  if (!incomingOfferings) {
    incomingOfferings = []
  }

  return {
    incomingOfferings,
    sentOfferings
  }

}

const getOfferingsAsOfferingUser = async () => {
  try {
    const res = await fetch(`/request/offerings/offering-user`);
    if (res.ok) {
      const data: TripRequestOffering[] = await res.json();
      return data;
    }
    const data = await res.json();
    console.error(data);
  } catch (e) {
    console.error(e)
  }
}

export const getOfferingsAsRequestingUser = async () => {
  try {
    const res = await fetch(`/request/offerings/requesting-user`);
    if (res.ok) {
      const data: TripRequestOffering[] = await res.json();
      return data;
    }
    const data = await res.json();
    console.error(data);
  } catch (e) {
    console.error(e)
  }
}

export const updateTripRequest = async (id: number, data: UpdateTripRequestData) => {
  try {
    const response = await fetch(`/request/offerings/update-params/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data),
    });
    return response.ok;

  } catch (e) {
    console.error(e)
  }
}

export interface UpdateTripRequestData {
  requestedCoins: number;
  text: string;
}


export const notTransformRequest = async (id: number) => {
  try {
    const response = await fetch(`/request/not-transform/${id}`, {
      method: "POST"
    });
    return response.ok;

  } catch (e) {
    console.error(e)
  }
}

export const transformRequest = async (id: number, data: PostTransformToOfferDto) => {
  try {
    const response = await fetch(`/request/transform-to-offer/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data),
    });
    return response.ok;

  } catch (e) {
    console.error(e)
  }
}

export interface PostTransformToOfferDto {
  additionalSeats: number;

  vehicleId: string|number;

  startDate: string;

  description: string;

  route: CreateRoutePart[] | undefined;
}

export class CreateRoutePart {
  plz: string | undefined;
  location: string | undefined;
  position: number | undefined;
}