import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';

describe('OfferService', () => {
  let provider: OfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferService],
    }).compile();

    provider = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
