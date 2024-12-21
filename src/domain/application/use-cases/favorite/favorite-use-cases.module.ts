import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { FindAllFavoritesByUserIdUseCase } from './find-all-favorites-by-user-id.use-case';
import { FindAllFavoritesUseCase } from './find-all-favorites.use-case';
import { FindDistinctFavoritesCountUseCase } from './find-distinct-favorites-count';
import { FindFavoritesCountUseCase } from './find-favorites-count';
import { HandleFavoriteUseCase } from './handle-favorite.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    FindAllFavoritesUseCase,
    FindAllFavoritesByUserIdUseCase,
    FindDistinctFavoritesCountUseCase,
    FindFavoritesCountUseCase,
    HandleFavoriteUseCase,
  ],
  exports: [
    FindAllFavoritesUseCase,
    FindAllFavoritesByUserIdUseCase,
    FindDistinctFavoritesCountUseCase,
    FindFavoritesCountUseCase,
    HandleFavoriteUseCase,
  ],
})
export class FavoriteUseCasesModule {}
