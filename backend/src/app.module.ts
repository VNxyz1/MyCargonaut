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
import {Offer} from "./database/Offer";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/tmp.sqlite',
      entities: [User, Offer],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Offer]),
  ],
  controllers: [UserController, AuthController, OfferController],
  providers: [UserService, AuthService, OfferService],
})
export class AppModule {}
