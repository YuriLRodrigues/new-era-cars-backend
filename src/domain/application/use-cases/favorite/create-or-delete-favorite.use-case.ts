import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, right } from '@root/core/logic/Either';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';

import { FavoriteRepository } from '../../repositories/favorite.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<Error, FavoriteEntity | null>;

export class CreateOrDeleteFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isSome: alreadyFavorited, value: favorite } = await this.favoriteRepository.findByUserId({
      advertisementId,
      userId,
    });

    if (alreadyFavorited()) {
      await this.favoriteRepository.delete({ favoriteId: favorite.id, userId: favorite.userId });

      return right(null);
    }

    const favoriteEntity = FavoriteEntity.create({
      advertisementId,
      userId,
    });

    await this.favoriteRepository.create({ favorite: favoriteEntity });

    return right(favoriteEntity);
  }
}
