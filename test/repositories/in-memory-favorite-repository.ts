import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FavoriteRepository,
  DeleteProps,
  FindAllByUserIdProps,
  FindAllProps,
  FindByUserIdProps,
} from '@root/domain/application/repositories/favorite.repository';
import { Capacity, Doors, Fuel, GearBox } from '@root/domain/enterprise/entities/advertisement.entity';
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

  async findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<FavoriteDetails[]> {
    const favorites = await this.favorites.filter((fav) => fav.userId.toValue() === userId.toValue());

    const mappedFavorites = favorites.map((fav) => {
      const advertisement = this.advertisementRespository.advertisements.find(
        (ad) => ad.id.toValue() === fav.advertisementId.toValue(),
      );

      return FavoriteDetails.create({
        advertisement: {
          capacity: Capacity[advertisement.capacity],
          doors: Doors[advertisement.doors],
          fuel: Fuel[advertisement.fuel],
          gearBox: GearBox[advertisement.gearBox],
          id: advertisement.id,
          km: advertisement.km,
          price: advertisement.price,
          thumbnailUrl: advertisement.thumbnailUrl,
          title: advertisement.title,
        },
        id: fav.id,
      });
    });

    const paginetedFavorites = mappedFavorites.slice((page - 1) * limit, limit * page);

    return Maybe.some(paginetedFavorites);
  }

  async findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity> {
    const favorite = this.favorites.find(
      (fav) => fav.advertisementId.toValue() === advertisementId.toValue() && fav.userId.toValue() === userId.toValue(),
    );

    if (!favorite) return null;

    return Maybe.some(favorite);
  }

  async delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void> {
    const favorites = await this.favorites.filter(
      (fav) => fav.id.toValue() !== favoriteId.toValue() && fav.userId.toValue() === userId.toValue(),
    );

    this.favorites = favorites;

    return;
  }
}
