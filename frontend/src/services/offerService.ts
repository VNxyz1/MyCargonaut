import {Offer} from "../interfaces/Offer.ts";
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