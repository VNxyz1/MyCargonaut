import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateVehicleDto } from './DTOs/CreateVehicleDto';
import { ISession } from '../../utils/ISession';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { GetVehicleResponseDto } from './DTOs/GetVehicleResponseDto';
import { ChangedDto } from './DTOs/ChangedDto';

@ApiTags('vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Creates a new vehicle' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async postUser(@Body() body: CreateVehicleDto, @Session() session: ISession) {
    const userId = session.userData.id;
    await this.vehicleService.creatingVehicle(userId, body);
    return new OKResponseWithMessageDTO(true, 'Vehicle Created');
  }

  @Get('own')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Gets all vehicles of logged in user' })
  @ApiResponse({ type: GetVehicleResponseDto })
  async getVehicleOfUser(@Session() session: ISession) {
    const userId = session.userData.id;
    const vehicleList = await this.vehicleService.getAllVehicle(userId);
    const vehicleDto = new GetVehicleResponseDto();
    vehicleDto.vehicleList = [];
    for (const vehicle of vehicleList) {
      const newVehicleList: CreateVehicleDto = new CreateVehicleDto();
      newVehicleList.id = vehicle.id;
      newVehicleList.name = vehicle.name;
      newVehicleList.seats = vehicle.seats;
      newVehicleList.type = vehicle.type;
      newVehicleList.description = vehicle.description;
      newVehicleList.picture = vehicle.picture;

      vehicleDto.vehicleList.push(newVehicleList);
    }
    return vehicleDto;
  }

  @Put('props/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Updates a vehicle of logged in user' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async updateOffer(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) vehicleId: number,
    @Body() body: ChangedDto,
  ) {
    const userId = session.userData.id;
    const offer = await this.vehicleService.getVehicle(vehicleId, userId);
    await this.vehicleService.changeVehicle(body, offer);
    return new OKResponseWithMessageDTO(true, 'Vehicleinformation changed');
  }

  @Delete('delete/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Delete vehicle of logged in User' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async deleteVehicle(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) vehicleId: number,
  ) {
    const userId = session.userData.id;
    const vehicle = await this.vehicleService.getVehicle(vehicleId, userId);
    await this.vehicleService.deleteVehicle(vehicle);
    return new OKResponseWithMessageDTO(true, 'Vehicle deleted!');
  }
}
