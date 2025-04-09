import { Test, TestingModule } from '@nestjs/testing';
import { HeartPressController } from './heart-press.controller';
import { HeartPressService } from './heart-press.service';

describe('HeartPressController', () => {
  let controller: HeartPressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeartPressController],
      providers: [HeartPressService],
    }).compile();

    controller = module.get<HeartPressController>(HeartPressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
