import { Test, TestingModule } from '@nestjs/testing';
import { StableDiffusionIntegrationController } from './stable-diffusion-integration.controller';

describe('StableDiffusionIntegrationController', () => {
  let controller: StableDiffusionIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StableDiffusionIntegrationController],
    }).compile();

    controller = module.get<StableDiffusionIntegrationController>(
      StableDiffusionIntegrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
