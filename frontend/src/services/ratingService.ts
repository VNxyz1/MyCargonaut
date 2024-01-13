import { GetUserRatings } from "../interfaces/Rating.ts";

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
}