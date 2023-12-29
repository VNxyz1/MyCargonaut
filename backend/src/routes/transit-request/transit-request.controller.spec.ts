import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestController } from './transit-request.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { UserService } from '../user.service/user.service';
import { AuthService } from '../auth.service/auth.service';
import { TransitRequestService } from '../transit-request.service/transit-request.service';
import { OfferService } from '../offer.service/offer.service';
import * as fs from 'fs';

describe('TransitRequestController', () => {
  let transitController: TransitRequestController;
  let authController: AuthController;
  let userForThisTest: User;
  const session: ISession = new MockSession();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.transit.controller.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest, RoutePart]),
      ],
      controllers: [AuthController, TransitRequestController],
      providers: [
        UserService,
        AuthService,
        TransitRequestService,
        OfferService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    transitController = module.get<TransitRequestController>(
      TransitRequestController,
    );
  });

  it('should be defined', () => {
    expect(transitController).toBeDefined();
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.transit.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
