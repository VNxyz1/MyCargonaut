import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserController } from './routes/user/user.controller';
import { UserService } from './routes/user.service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './routes/auth.service/auth.service';
import { OfferService } from './routes/offer.service/offer.service';
import { OfferController } from './routes/offer/offer.controller';
import { TransitRequestService } from './routes/transit-request.service/transit-request.service';
import { TransitRequestController } from './routes/transit-request/transit-request.controller';
import { MulterModule } from '@nestjs/platform-express';
import { RequestController } from './routes/request/request.controller';
import { RequestService } from './routes/request.service/request.service';
import { PlzService } from './routes/plz.service/plz.service';
import { entityArr, sqlite_setup } from './utils/sqlite_setup';
import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';

let user: Buffer;
let pass: Buffer;

if (process.env.RUNNS_ON_DOCKER === 'true') {
  const userPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    process.env.DB_USER_FILE,
  );
  const passPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    process.env.DB_PASSWORD_FILE,
  );

  user = fs.readFileSync(userPath);
  pass = fs.readFileSync(passPath);
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    process.env.RUNNS_ON_DOCKER === 'true'
      ? TypeOrmModule.forRoot({
          type: 'mysql',
          database: process.env.DB_DATABASE,
          port: Number(process.env.DB_PORT),
          host: process.env.DB_HOST,
          username: user.toString(),
          password: pass.toString(),
          entities: entityArr,
          synchronize: true,
        })
      : sqlite_setup('./db/tmp.sqlite'),
    TypeOrmModule.forFeature(entityArr),
  ],
  controllers: [
    UserController,
    AuthController,
    OfferController,
    TransitRequestController,
    RequestController,
  ],
  providers: [
    UserService,
    AuthService,
    OfferService,
    TransitRequestService,
    RequestService,
    PlzService,
  ],
})
export class AppModule {}
