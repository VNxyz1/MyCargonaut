import {
  Body,
  Controller,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { PostTripRequestRequestDto } from './DTOs/PostTripRequestRequestDto';
import { extname } from 'path';
import { ISession } from '../../utils/ISession';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TripRequest } from '../../database/TripRequest';
import { PlzService } from '../plz.service/plz.service';
import { RequestService } from '../request.service/request.service';
import { User } from '../../database/User';
import { UserService } from '../user.service/user.service';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly plzService: PlzService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(
    FileInterceptor('cargoImg', {
      storage: diskStorage({
        destination: './uploads/cargo-images',
        filename: (req: any, file, callback) => {
          const uniquSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = req.session.userData.id;
          const ext = extname(file.originalname);
          const filename = `ci-${prefix}-${uniquSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Creates a new trip request' })
  @ApiResponse({ type: OKResponseWithMessageDTO })
  async postTripRequest(
    @Body() body: PostTripRequestRequestDto,
    @Session() session: ISession,
    @UploadedFile() cargoImg: Express.Multer.File,
  ) {
    const user = await this.userService.getUserById(session.userData.id);
    const tR = await this.createTripRequest(body, cargoImg, user);

    await this.requestService.save(tR);

    return new OKResponseWithMessageDTO(true, 'Trip request created');
  }

  async createTripRequest(
    dto: PostTripRequestRequestDto,
    cargoImg: Express.Multer.File,
    user: User,
  ) {
    const tR = new TripRequest();

    tR.cargoImg = cargoImg.filename;

    tR.requester = user;

    tR.startPlz = await this.plzService.createPlz(
      dto.startPlz.plz,
      dto.startPlz.location,
    );
    tR.endPlz = await this.plzService.createPlz(
      dto.endPlz.plz,
      dto.endPlz.location,
    );

    tR.startDate = new Date(dto.startDate);

    tR.description = dto.description;
    tR.seats = dto.seats;

    return tR;
  }
}
