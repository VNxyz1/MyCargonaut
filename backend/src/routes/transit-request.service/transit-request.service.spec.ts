import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestService } from './transit-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';

describe('TransitRequestService', () => {
  let transitService: TransitRequestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.transit.service.sqlite'),
        TypeOrmModule.forFeature(entityArr),
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
