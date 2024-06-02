import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FavoriteRepository,
  DeleteProps,
  FindAllByUserIdProps,
  FindAllProps,
  FindByUserIdProps,
} from '@root/domain/application/repositories/favorite.repository';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';
import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

import { InMemoryAdvertisementRepository } from './in-memory-advertisement-repository';
import { InMemoryUserRepository } from './in-memory-user-repository';

export class InMemoryFavoriteRepository implements FavoriteRepository {
  constructor(
    private readonly advertisementRespository: InMemoryAdvertisementRepository,
    private readonly userRepository: InMemoryUserRepository,
  ) {}

  public favorites: FavoriteEntity[] = [];

  async create({ favorite }: CreateProps): AsyncMaybe<FavoriteEntity> {
    this.favorites.push(favorite);

    return Maybe.some(favorite);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<FavoriteAdminDetails[]> {
    const favorites = await this.favorites.map((fav) => {
      const advertisement = this.advertisementRespository.advertisements.find(
        (ad) => ad.id.toValue() === fav.advertisementId.toValue(),
      );

      const user = this.userRepository.users.find((user) => user.id.toValue() === advertisement.userId.toValue());

      return FavoriteAdminDetails.create({
        createdAt: fav.createdAt,
        favorites: this.favorites.filter((fav) => fav.advertisementId.toValue() === advertisement.id.toValue()).length,
        id: fav.advertisementId,
        user: {
          avatar: user.avatar,
          id: user.id,
          name: user.name,
        },
        advertisement: {
          id: advertisement.id,
          price: advertisement.price,
          status: advertisement.soldStatus,
          thumbnailUrl: advertisement.thumbnailUrl,
          title: advertisement.title,
        },
      });
    });

    const mappedFavorites = favorites.slice((page - 1) * limit, limit * page);

    return Maybe.some(mappedFavorites);
  }

  findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<FavoriteDetails[]> {
    throw new Error('Method not implemented.');
  }
  findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity> {
    throw new Error('Method not implemented.');
  }
  delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void> {
    throw new Error('Method not implemented.');
  }
}
