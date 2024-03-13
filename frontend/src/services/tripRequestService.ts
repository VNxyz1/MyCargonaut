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
  console.log(id)
  try {
    //Todo: muss im backend implementiert werden
    return false
  } catch (e) {
    console.error(e)
  }
}

export const postRequest = async (body: PostRequestBody) => {
  try {
    const response = await fetch(`/request`,{
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(body),
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

const getOfferingsAsRequestingUser = async () => {
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