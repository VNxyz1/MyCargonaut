import {Offer, OfferList} from "../interfaces/Offer.ts";
import { TransitRequest } from "../interfaces/TransitRequest.ts";

export const getOfferById = async (id: number) => {
    try {
        const res = await fetch(`/offer/one/${id}`);
        if(res.ok){
            const data: Offer = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}

export const getOwnOffers = async () => {
    try {
        const res = await fetch(`/offer/own`);
        if(res.ok){
            const data: OfferList = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}

export const getPassengerOffers = async () => {
    try {
        const res = await fetch(`/offer/own/passenger`);
        if(res.ok){
            const data: OfferList = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}

export const getAllOffers = async () => {
    try {
        const res = await fetch(`/offer`);
        if(res.ok){
            const data: OfferList = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}


export const updateTransitRequest = async (id: number, data: UpdateTransitRequestData) => {
    try {
        const response = await fetch(`/transit-request/update-params/${id}`, {
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

export interface UpdateTransitRequestData {
    offeredCoins: number;
    requestedSeats: number;
    text: string;
}

export const deleteTransitRequest = async (id: number) => {
    try {
        const response = await fetch(`/transit-request/${id}`, {
            method: "DELETE"
        });
        return response.ok;

    } catch (e) {
        console.error(e)
    }
}

export const acceptTransitRequest = async (id: number) => {
    try {
        const response = await fetch(`/transit-request/accept/${id}`, {
            method: "PUT"
        });
        return response.ok;

    } catch (e) {
        console.error(e)
    }
}

export const declineTransitRequest = async (id: number) => {
    try {
        const response = await fetch(`/transit-request/decline/${id}`, {
            method: "PUT"
        });
        return response.ok;

    } catch (e) {
        console.error(e)
    }
}

export const getTransitRequests = async () => {

    let sentTransitRequests = await getSentTransitRequests();
    let incomingTransitRequests = await getReceivedTransitRequests();

    if (!sentTransitRequests) {
        sentTransitRequests = []
    }
    if (!incomingTransitRequests) {
        incomingTransitRequests = []
    }

    return {
        sentTransitRequests,
        incomingTransitRequests
    }

}

const getSentTransitRequests = async ():Promise<TransitRequest[] | undefined> => {
    try {
        const res = await fetch(`/transit-request/all`);
        if (res.ok) {
            const data = await res.json();
            return data.transitRequests;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}

const getReceivedTransitRequests = async ():Promise<TransitRequest[] | undefined> => {
    try {
        const res = await fetch(`/transit-request/received`);
        if (res.ok) {
            const data = await res.json();
            return data.transitRequests;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}