import { Test, TestingModule } from '@nestjs/testing';
import { RequestOfferingService } from './request-offering.service';

describe('RequestOfferingService', () => {
  let provider: RequestOfferingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestOfferingService],
    }).compile();

    provider = module.get<RequestOfferingService>(RequestOfferingService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
