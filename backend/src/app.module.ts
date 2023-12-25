import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserController } from './routes/user/user.controller';
import { UserService } from './routes/user.service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/User';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './routes/auth.service/auth.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/tmp.sqlite',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class AppModule {}
