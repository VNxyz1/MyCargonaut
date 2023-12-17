import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestController } from './transit-request.controller';

describe('TransitRequestController', () => {
  let controller: TransitRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransitRequestController],
    }).compile();

    controller = module.get<TransitRequestController>(TransitRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
