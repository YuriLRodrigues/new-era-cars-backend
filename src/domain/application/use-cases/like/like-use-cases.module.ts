import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateFeedbackUseCase } from '../feedback/create-feedback.use-case';
import { CreateLikeAdvertisementUseCase } from './create-like-advertisement.use-case';
import { CreateLikeFeedbackUseCase } from './create-like-feedback.use-case';
import { FindAdvertisementIsLikedUseCase } from './find-advertisement-is-liked.use-case';
import { FindAllAdvertisementLikesUseCase } from './find-all-advertisement-likes.use-case';
import { FindAllFeedbackLikesUseCase } from './find-all-feedback-likes.use-case';
import { FindFeedbackIsLikedUseCase } from './find-feedback-is-liked.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    FindFeedbackIsLikedUseCase,
    FindAllFeedbackLikesUseCase,
    CreateFeedbackUseCase,
    FindAdvertisementIsLikedUseCase,
    FindAllAdvertisementLikesUseCase,
    CreateLikeAdvertisementUseCase,
    CreateLikeFeedbackUseCase,
  ],
  exports: [
    FindFeedbackIsLikedUseCase,
    FindAllFeedbackLikesUseCase,
    CreateFeedbackUseCase,
    FindAdvertisementIsLikedUseCase,
    FindAllAdvertisementLikesUseCase,
    CreateLikeFeedbackUseCase,
    CreateLikeAdvertisementUseCase,
  ],
})
export class LikeUseCaseModule {}
