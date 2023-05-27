import { Injectable } from '@nestjs/common';
import { GenerateImageDto } from './generate-image.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { getDataFolderPath, persistData } from 'src/utils/file.utils';

@Injectable()
export class StableDiffusionIntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(generateImage: GenerateImageDto) {
    const engineId = 'stable-diffusion-v1-5';
    const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
    const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) throw new Error('Missing Stability API key.');

    const prompts: any[] = [
      {
        text: generateImage.prompt,
        weight: 1,
      },
    ];

    if (generateImage.negativePrompt) {
      prompts.push({
        text: generateImage.negativePrompt,
        weight: -1,
      });
    }

    const result = await this.httpService.post(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        text_prompts: prompts,
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: generateImage.imageHeight,
        width: generateImage.imageWidth,
        samples: 1,
        steps: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'image/png',
          Authorization: apiKey,
        },
        responseType: 'arraybuffer',
      },
    );

    const data = await lastValueFrom(result);
    const filePath = `${getDataFolderPath()}/${Date.now()}.png`;
    persistData(Buffer.from(data.data), filePath);

    console.log(filePath);
    return filePath;
  }
}
