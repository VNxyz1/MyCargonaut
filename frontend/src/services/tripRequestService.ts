import {TripRequest} from "../interfaces/TripRequest.ts";

export const getTripRequestById = async (id: number) => {
    try {
        const res = await fetch(`/request/one/${id}`);
        if(res.ok){
            const data: TripRequest = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}

export const getOfferings = async (id: number) => {
    try {
        const res = await fetch(`/request/one/${id}`);
        if(res.ok){
            const data: TripRequest = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
}