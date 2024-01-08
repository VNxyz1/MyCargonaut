import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserController } from './routes/user/user.controller';
import { UserService } from './routes/user.service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/User';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './routes/auth.service/auth.service';
import { OfferService } from './routes/offer.service/offer.service';
import { OfferController } from './routes/offer/offer.controller';
import { Offer } from './database/Offer';
import { Plz } from './database/Plz';
import { TransitRequest } from './database/TransitRequest';
import { TransitRequestService } from './routes/transit-request.service/transit-request.service';
import { TransitRequestController } from './routes/transit-request/transit-request.controller';
import { MulterModule } from '@nestjs/platform-express';
import { RoutePart } from './database/RoutePart';
import { Rating } from './database/Rating';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/tmp.sqlite',
      entities: [User, Offer, Plz, TransitRequest, RoutePart, Rating],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest, RoutePart, Rating]),
  ],
  controllers: [
    UserController,
    AuthController,
    OfferController,
    TransitRequestController,
  ],
  providers: [UserService, AuthService, OfferService, TransitRequestService],
})
export class AppModule {}
