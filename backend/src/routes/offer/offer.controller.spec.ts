import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { AuthService } from '../auth.service/auth.service';
import { OfferService } from '../offer.service/offer.service';
import * as fs from 'fs';

describe('OfferController', () => {
  let offerController: OfferController;
  let authController: AuthController;
  let userForThisTest: User;
  const session: ISession = new MockSession();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.offer.controller.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest, RoutePart]),
      ],
      controllers: [AuthController, OfferController],
      providers: [AuthService, OfferService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    offerController = module.get<OfferController>(OfferController);
  });

  it('should be defined', () => {
    expect(offerController).toBeDefined();
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.offer.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
