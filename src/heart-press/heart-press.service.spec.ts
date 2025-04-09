import { Test, TestingModule } from '@nestjs/testing';
import { HeartPressService } from './heart-press.service';

describe('HeartPressService', () => {
  let service: HeartPressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeartPressService],
    }).compile();

    service = module.get<HeartPressService>(HeartPressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
