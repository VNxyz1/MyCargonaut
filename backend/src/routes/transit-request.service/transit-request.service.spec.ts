import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestService } from './transit-request.service';

describe('TransitRequestService', () => {
  let provider: TransitRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransitRequestService],
    }).compile();

    provider = module.get<TransitRequestService>(TransitRequestService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
