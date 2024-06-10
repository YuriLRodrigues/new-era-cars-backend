import { UpdatedAd200DTO } from './update-200.dto';
import { UpdateAd400DTO } from './update-400.dto';
import { Update403DTO } from './update-403.dto';
import { Update404DTO } from './update-404.dto';

export const UpdateAdResponseSwagger = {
  200: UpdatedAd200DTO,
  400: UpdateAd400DTO,
  403: Update403DTO,
  404: Update404DTO,
};
