import { Vehicle } from "../../database/Vehicle";
import { CreateVehicleDto } from "../vehicle/DTOs/CreateVehicleDto";

export const convertVehicleToCreateVehicleDto = (vehicle: Vehicle) => {
    const createVehicleDto: CreateVehicleDto = new CreateVehicleDto();
        createVehicleDto.id = vehicle.id;
    createVehicleDto.name = vehicle.name;
    createVehicleDto.picture = vehicle.picture;
    createVehicleDto.description = vehicle.description;
    createVehicleDto.seats = vehicle.seats;
    createVehicleDto.type = vehicle.type;
  
    return createVehicleDto;
  };