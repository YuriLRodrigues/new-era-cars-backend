import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { FeedbackRepository } from '../../repositories/feedback.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
  comment: string;
  stars: number;
};

type Output = Either<Error, FeedbackEntity>;

@Injectable()
export class CreateFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId, userId, comment, stars }: Input): Promise<Output> {
    const { isNone: advertisementNotExists } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotExists()) {
      return left(new Error('Advertisement not found'));
    }

    const feedback = FeedbackEntity.create({
      userId,
      advertisementId,
      comment,
      stars,
    });

    await this.feedbackRepository.create({
      feedback,
    });

    return right(feedback);
  }
}
