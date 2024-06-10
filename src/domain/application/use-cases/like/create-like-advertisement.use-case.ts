import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { LikeAdvertisementRepository } from '../../repositories/like-advertisement.reposiotry';

type Input = {
  userId: UniqueEntityId;
  advertisementId: UniqueEntityId;
};

type Output = Either<Error, LikeEntity | null>;

export class CreateLikeAdvertisementUseCase {
  constructor(
    private readonly likeAdvertisementRepository: LikeAdvertisementRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isNone: advertisementNotExists } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotExists()) {
      return left(new Error('Advertisement not found'));
    }

    const { isSome: alreadyLiked, value: like } = await this.likeAdvertisementRepository.findById({
      advertisementId,
    });

    if (alreadyLiked()) {
      await this.likeAdvertisementRepository.delete({ likeId: like.id });

      return right(null);
    }

    const likeEntity = LikeEntity.create({
      userId,
      advertisementId,
    });

    await this.likeAdvertisementRepository.create({ like: likeEntity });

    return right(likeEntity);
  }
}
