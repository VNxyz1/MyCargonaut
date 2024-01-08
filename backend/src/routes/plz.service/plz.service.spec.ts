import { Test, TestingModule } from '@nestjs/testing';
import { PlzService } from './plz.service';

describe('PlzService', () => {
  let provider: PlzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlzService],
    }).compile();

    provider = module.get<PlzService>(PlzService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
