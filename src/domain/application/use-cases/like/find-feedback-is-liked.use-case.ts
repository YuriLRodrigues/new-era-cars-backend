import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';

import { LikeFeedbackRepository } from '../../repositories/like-feedback.reposiotry';

type Input = {
  feedbackId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<boolean, boolean>;

export class FindFeedbackIsLikedUseCase {
  constructor(private readonly likeFeedbackRepository: LikeFeedbackRepository) {}

  async execute({ feedbackId }: Input): Promise<Output> {
    const { isSome: alreadyLiked } = await this.likeFeedbackRepository.findById({ feedbackId });

    if (alreadyLiked()) {
      return right(true);
    }

    return left(false);
  }
}
