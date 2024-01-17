import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from '../vehicle/DTOs/CreateVehicleDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { Vehicle } from '../../database/Vehicle';
import { ChangedDto } from '../vehicle/DTOs/ChangedDto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async creatingVehicle(providerId: number, vehicleDto: CreateVehicleDto) {
    const vehicle = new Vehicle();
    vehicle.name = vehicleDto.name;
    vehicle.seats = vehicleDto.seats;
    vehicle.type = vehicleDto.type;
    vehicle.description = vehicleDto.description;
    vehicle.picture = vehicleDto.picture;

    vehicle.owner = await this.userRepository.findOne({
      where: { id: providerId },
    });

    const vehicleDb = await this.vehicleRepository.save(vehicle);

    return vehicleDb;
  }

  async getAllVehicle(userId: number) {
    return await this.vehicleRepository.find({
      where: { owner: { id: userId } },
    });
  }
  async getExixtsVehicle(vehicleId: number) {
    let vehicle = await this.vehicleRepository.find({
      where: { id: vehicleId },
    });
    console.log(vehicle[0]);
    if(vehicle[0])return true;
    return false;
  }

  async getVehicle(id: number, userId: number) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: id },
    });
    if (!vehicle) {
      throw new InternalServerErrorException("Can't delete your legs!");
    }

    if (vehicle.owner.id !== userId) {
      throw new InternalServerErrorException(
        "You're not the owner of the vehicle.",
      );
    }

    return vehicle;
  }

  async changeVehicle(changedInfo: ChangedDto, vehicle: Vehicle) {
    if (changedInfo.name) {
      vehicle.name = changedInfo.name;
    }

    if (changedInfo.seats) {
      vehicle.seats = changedInfo.seats;
    }

    if (changedInfo.type >= 0) {
      vehicle.type = changedInfo.type;
    }

    if (changedInfo.description) {
      vehicle.description = changedInfo.description;
    }

    if (changedInfo.picture) {
      vehicle.picture = changedInfo.picture;
    }

    await this.vehicleRepository.save(vehicle);

    return this.getVehicle(vehicle.id, vehicle.owner.id);
  }

  async deleteVehicle(vehicle: Vehicle) {
    await this.vehicleRepository.remove(vehicle);
  }

  async removeOldImage(vehicleId: number, userId: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found.`);
    }
    if (vehicle.owner.id !== userId) {
      throw new InternalServerErrorException(
        "You're not the owner of the vehicle.",
      );
    }
    if (vehicle.picture && vehicle.picture.length > 0) {
      const oldImagePath = join(
        process.cwd(),
        'uploads',
        'profile-images',
        vehicle.picture,
      );
      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath);
      }
    }
  }

  async saveProfileImagePath(
    vehicleId: number,
    userId: number,
    imagePath: string,
  ): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found.`);
    }

    if (vehicle.owner.id !== userId) {
      throw new InternalServerErrorException(
        "You're not the owner of the vehicle.",
      );
    }
    vehicle.picture = imagePath;
    await this.vehicleRepository.save(vehicle);
  }
}
