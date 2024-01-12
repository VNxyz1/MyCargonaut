import { Test, TestingModule } from '@nestjs/testing';
import { PlzService } from './plz.service';
import { UserController } from '../user/user.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { TripRequest } from '../../database/TripRequest';
import { UserService } from '../user.service/user.service';
import { AuthService } from '../auth.service/auth.service';
import * as fs from 'fs';

describe('PlzService', () => {
  let userController: UserController;
  let plzService: PlzService;
  let userForThisTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.plz.service.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart, TripRequest],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          User,
          Offer,
          Plz,
          TransitRequest,
          RoutePart,
          TripRequest,
        ]),
      ],
      controllers: [UserController, AuthController],
      providers: [UserService, AuthService, PlzService],
    }).compile();

    userController = module.get<UserController>(UserController);
    plzService = module.get<PlzService>(PlzService);
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.plz.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(plzService).toBeDefined();
  });
});
