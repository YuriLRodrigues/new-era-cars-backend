import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';
import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

export type FindAllProps = {
  limit: number;
  page: number;
};

export type FindAllByUserIdProps = {
  limit: number;
  page: number;
  userId: UniqueEntityId;
};

export type CreateProps = {
  favorite: FavoriteEntity;
};

export type FindByUserIdProps = {
  userId: UniqueEntityId;
  advertisementId: UniqueEntityId;
};

export type DeleteProps = {
  userId: UniqueEntityId;
  favoriteId: UniqueEntityId;
};

export abstract class FavoriteRepository {
  abstract create({ favorite }: CreateProps): AsyncMaybe<FavoriteEntity>;
  abstract findAll({ limit, page }: FindAllProps): AsyncMaybe<FavoriteAdminDetails[]>;
  abstract findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<FavoriteDetails[]>;
  abstract findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity>;
  abstract delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void>;
}
