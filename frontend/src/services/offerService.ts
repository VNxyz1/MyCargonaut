import {Offer} from "../interfaces/Offer.ts";

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