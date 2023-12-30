import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestService } from './transit-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import * as fs from 'fs';

describe('TransitRequestService', () => {
  let transitService: TransitRequestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.transit.service.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest, RoutePart]),
      ],
      providers: [TransitRequestService],
    }).compile();

    transitService = module.get<TransitRequestService>(TransitRequestService);
  });

  it('should be defined', () => {
    expect(transitService).toBeDefined();
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.transit.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});