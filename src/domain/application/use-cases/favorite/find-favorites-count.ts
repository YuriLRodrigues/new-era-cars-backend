import { Either, right } from '@root/core/logic/Either';

import { FavoriteRepository } from '../../repositories/favorite.repository';

type Output = Either<Error, number>;

export class FindFavoritesCountUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(): Promise<Output> {
    const { value: favorites } = await this.favoriteRepository.findTotalCount();

    return right(favorites);
  }
}
