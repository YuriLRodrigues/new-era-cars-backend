import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';

import { LikeAdvertisementRepository } from '../../repositories/like-advertisement.reposiotry';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<boolean, boolean>;

export class FindAdvertisementIsLikedUseCase {
  constructor(private readonly likeAdvertisementRepository: LikeAdvertisementRepository) {}

  async execute({ advertisementId }: Input): Promise<Output> {
    const { isSome: alreadyLiked } = await this.likeAdvertisementRepository.findById({ advertisementId });

    if (alreadyLiked()) {
      return right(true);
    }

    return left(false);
  }
}
