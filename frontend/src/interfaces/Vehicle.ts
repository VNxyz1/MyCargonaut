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

export interface CreateVehicleResponse {
    id: number;
}


