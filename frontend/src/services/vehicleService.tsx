//import {Vehicle} from "../interfaces/Vehicle";

//post
//get
//put

export const deleteVehicle = async (id: number): Promise<boolean> => {
    try {
        const res = await fetch(`/vehicle/${id}`, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
        });

        if (res.ok) {
            console.log('Vehicle profile deleted successfully');
            return true;
        } else {
            console.error('Error deleting Vehicle profile');
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};