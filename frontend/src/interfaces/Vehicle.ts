export interface Vehicle {
    id: number,
    name: string,
    seats: number,
    type: number,
    description: string,
    picture?: string
}

export interface CreateVehicleData {
    name: string,
    seats: number,
    type: number,
    description: string,
    picture?: string
}

export interface EditVehicleData {
    name?: string,
    seats?: number,
    type?: number,
    description?: string,
    picture?: string
}

export interface CreateVehicleResponse {
    id: number;
}

export const VehicleTypes = [
    "PKW",
    "LKW",
    "SUV",
    "Kleinwagen",
    "Kombi",
    "Cabriolet",
    "Coupé",
    "Geländewagen",
    "Van",
    "Minivan",
    "Sportwagen",
    "Limousine",
    "Nutzfahrzeug",
];


