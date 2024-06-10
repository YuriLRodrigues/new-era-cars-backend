import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, right } from '@root/core/logic/Either';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

import { FavoriteRepository } from '../../repositories/favorite.repository';

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

type Output = Either<Error, FavoriteDetails[]>;

export class FindAllFavoritesByUserIdUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute({ userId, page, limit }: Input): Promise<Output> {
    const { value: favorites } = await this.favoriteRepository.findAllByUserId({
      userId,
      page,
      limit,
    });

    return right(favorites);
  }
}
