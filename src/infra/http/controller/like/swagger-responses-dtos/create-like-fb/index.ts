import { CreateLikeAd400DTO } from '../create-like-ad/create-like-ad-400.dto';
import { CreateLikeAd404DTO } from '../create-like-ad/create-like-ad-404.dto';
import { CreateLikeFb201DTO } from './create-like-fb-201.dto';

export const CreateLikeFbResponsesSwagger = {
  201: CreateLikeFb201DTO,
  400: CreateLikeAd400DTO,
  404: CreateLikeAd404DTO,
};
