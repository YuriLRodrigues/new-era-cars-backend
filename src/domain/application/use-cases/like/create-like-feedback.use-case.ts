import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { LikeFeedbackRepository } from '../../repositories/like-feedback.reposiotry';

type Input = {
  userId: UniqueEntityId;
  feedbackId: UniqueEntityId;
};

type Output = Either<Error, LikeEntity | null>;

export class CreateLikeFeedbackUseCase {
  constructor(
    private readonly likeFeedbackRepository: LikeFeedbackRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async execute({ feedbackId, userId }: Input): Promise<Output> {
    const { isNone: feedbackNotExists } = await this.feedbackRepository.findById({ feedbackId });

    if (feedbackNotExists()) {
      return left(new Error('Feedback not found'));
    }

    const { isSome: alreadyLiked, value: like } = await this.likeFeedbackRepository.findById({
      feedbackId,
    });

    if (alreadyLiked()) {
      await this.likeFeedbackRepository.delete({ likeId: like.id });

      return right(null);
    }

    const likeEntity = LikeEntity.create({
      userId,
      feedbackId,
    });

    await this.likeFeedbackRepository.create({ like: likeEntity });

    return right(likeEntity);
  }
}
