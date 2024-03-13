import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateVehicleDto } from './DTOs/CreateVehicleDto';
import { ISession } from '../../utils/ISession';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { GetVehicleResponseDto } from './DTOs/GetVehicleResponseDto';
import { ChangedDto } from './DTOs/ChangedDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { CreateVehicleResponseDto } from './DTOs/CreateVehicleResponseDto';

@ApiTags('vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Creates a new vehicle' })
  @ApiResponse({ type: CreateVehicleResponseDto })
  async postUser(@Body() body: CreateVehicleDto, @Session() session: ISession) {
    const userId = session.userData.id;
    const vehicleDb = await this.vehicleService.creatingVehicle(userId, body);
    const vehicleDto = new CreateVehicleResponseDto();
    vehicleDto.id = vehicleDb.id;
    return vehicleDto;
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
  async deleteVehicle(@Session() session: ISession, @Param('id', ParseIntPipe) vehicleId: number) {
    const userId = session.userData.id;
    const vehicle = await this.vehicleService.getVehicle(vehicleId, userId);
    await this.vehicleService.deleteVehicle(vehicle);
    return new OKResponseWithMessageDTO(true, 'Vehicle deleted!');
  }

  @Put('upload/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Upload/Replace vehicle picture and update path in vehicle',
  })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/vehicle-images',
        filename: (req: any, file, callback) => {
          const uniquSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = req.session.userData.id;
          const ext = extname(file.originalname);
          const filename = `pp-${prefix}-${uniquSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadVehicleImage(
    @Session() session: ISession,
    @Param('id', ParseIntPipe) vehicleId: number,
    @UploadedFile() file: any,
  ) {
    try {
      this.vehicleService.removeOldImage(vehicleId, session.userData.id);
      this.vehicleService.saveProfileImagePath(vehicleId, session.userData.id, file.filename);
      return new OKResponseWithMessageDTO(true, 'Successfully updated vehicle image');
    } catch (error) {
      console.error('Error uploading vehicle image:', error);
      throw new InternalServerErrorException('Error uploading vehicle image');
    }
  }

  @Get('vehicle-image/:imagename')
  @ApiOperation({ summary: 'Get a vehicle picture' })
  @ApiResponse({
    description: 'Vehicle picture retrieved successfully',
    type: 'image/png',
  })
  async findVehicleImage(@Param('imagename') imagename: string, @Res() res: Response) {
    try {
      const imagePath = join(process.cwd(), 'uploads', 'vehicle-images', imagename);
      res.sendFile(imagePath);
    } catch (error) {
      return new InternalServerErrorException('Image not found');
    }
  }

  @Delete('remove-vehicle-image/:id')
  @UseGuards(IsLoggedInGuard)
  @ApiOperation({ summary: 'Remove vehicle picture' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async removeProfileImage(@Session() session: ISession, @Param('id', ParseIntPipe) vehicleId: number) {
    try {
      this.vehicleService.removeOldImage(vehicleId, session.userData.id);
      this.vehicleService.saveProfileImagePath(vehicleId, session.userData.id, '');
      return new OKResponseWithMessageDTO(true, 'Successfully removed vehicle image');
    } catch (error) {
      console.error('Error removing vehicle image:', error);
      throw new InternalServerErrorException('Error removing vehicle image');
    }
  }
}
