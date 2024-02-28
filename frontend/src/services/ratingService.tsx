import { GetUserRatings } from "../interfaces/Rating.ts";
import { JustDriverRating, JustPassengerRating } from "../interfaces/Rating.ts";


export const getRatingsById = async (id: number) => {
    try {
        const res = await fetch(`/rating/user/${id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        });
        if(res.ok){
            const data: GetUserRatings = await res.json();
            return data;
        }
        const data = await res.json();
        console.error(data);
    } catch (e) {
        console.error(e)
    }
};

export const ratingDriver = async (tripId: number, ratingData: JustDriverRating) => {
    try {
        const res = await fetch(`/rating/${tripId}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(ratingData)
        });

        if (res.ok) {
            console.log('Driver rated successfully');
            return await res.json();
        } else {
            console.error('Error rating driver');
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};


export const ratingPassenger = async (tripId: number, ratingData: JustPassengerRating) => {
    try {
        const res = await fetch(`/rating/${tripId}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(ratingData)
        });

        if (res.ok) {
            console.log('Passenger rated successfully');
            return await res.json();
        } else {
            console.error('Error rating passenger');
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};