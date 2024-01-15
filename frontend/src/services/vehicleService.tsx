import {CreateVehicleData, CreateVehicleResponse, Vehicle} from "../interfaces/Vehicle.ts";


export const getOwnVehicles = async (): Promise<Vehicle | null> => {
    try {
        const res = await fetch(`/vehicle/own`, {
            method: "GET",
            headers: { "Content-type": "application/json" },
        });

        if (res.ok) {
            const data = await res.json();
            return data.vehicleList;
        } else {
            console.error("Error fetching data");
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const deleteVehicle = async (id: number): Promise<boolean> => {
    try {
        // Vor dem Löschen des Fahrzeugs das Bild löschen
        const imageDeleted = await deleteVehicleProfileImage(id);
        if (!imageDeleted) {
            console.error('Error deleting Vehicle image');
            return false;
        }

        // Wenn das Bild erfolgreich gelöscht wurde, das Fahrzeug löschen
        const res = await fetch(`/vehicle/delete/${id}`, {
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


export const createVehicle = async (vehicleData: CreateVehicleData): Promise<CreateVehicleResponse | null> => {
    try {
        const res = await fetch(`/vehicle`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(vehicleData)
        });

        if (res.ok) {
            console.log('Vehicle created successfully');
            return await res.json();
        } else {
            console.error('Error creating Vehicle');
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/*-----Image-----*/
export const uploadVehicleImage = async (image: File, vehicleId: number): Promise<boolean> => {
    try {
        const vehicleImage = new FormData();
        vehicleImage.append('image', image);

        const imgRes = await fetch(`/vehicle/upload/${vehicleId}`, {
            method: 'PUT',
            body: vehicleImage,
        });

        if (!imgRes.ok) {
            const imageData = await imgRes.json();
            console.log('Image upload failed:', imageData);
            return false;
        } else {
            console.log('Image uploaded successfully');
            return true;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

//Todo - geht noch nicht
export const deleteVehicleProfileImage = async (vehicleId: number): Promise<boolean> => {
    try {
        const res = await fetch(`/vehicle/remove-vehicle-image/${vehicleId}`, {
            method: "DELETE",
            headers: {"Content-type": "application/json"},
        });

        if (res.ok) {
            console.log('Vehicle image deleted successfully');
            return true;
        } else {
            console.error('Error deleting vehicle image');
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};