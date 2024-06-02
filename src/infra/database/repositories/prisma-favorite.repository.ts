import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
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

import { FavoriteMappers } from '../mappers/favorite.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ favorite }: CreateProps): AsyncMaybe<FavoriteEntity> {
    const raw = FavoriteMappers.toPersistence(favorite);

    await this.prismaService.favorite.create({
      data: raw,
    });

    return Maybe.some(favorite);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<FavoriteAdminDetails[]> {
    const favorites = await this.prismaService.favorite.findMany({
      skip: page,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        advertisement: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            price: true,
            soldStatus: true,
            favorites: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const mappedFavorites = favorites.map((fav) =>
      FavoriteAdminDetails.create({
        id: new UniqueEntityId(fav.id),
        advertisement: {
          id: new UniqueEntityId(fav.advertisement.id),
          price: fav.advertisement.price,
          thumbnailUrl: fav.advertisement.thumbnailUrl,
          title: fav.advertisement.title,
          status: fav.advertisement.soldStatus,
        },
        user: {
          avatar: fav.user.avatar,
          id: new UniqueEntityId(fav.user.id),
          name: fav.user.name,
        },
        favorites: fav.advertisement.favorites.length,
        createdAt: fav.createdAt,
      }),
    );

    return Maybe.some(mappedFavorites);
  }

  async findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<FavoriteDetails[]> {
    const favorites = await this.prismaService.favorite.findMany({
      where: {
        userId: userId.toValue(),
      },
      skip: page,
      take: limit,

      select: {
        id: true,
        advertisement: {
          select: {
            doors: true,
            gearBox: true,
            fuel: true,
            km: true,
            capacity: true,
            title: true,
            price: true,
            thumbnailUrl: true,
            id: true,
          },
        },
      },
    });

    const mappedFavorites = favorites.map((fav) =>
      FavoriteDetails.create({
        id: new UniqueEntityId(fav.id),
        advertisement: {
          id: new UniqueEntityId(fav.advertisement.id),
          price: fav.advertisement.price,
          thumbnailUrl: fav.advertisement.thumbnailUrl,
          title: fav.advertisement.title,
          doors: Doors[fav.advertisement.doors],
          capacity: Capacity[fav.advertisement.capacity],
          fuel: Fuel[fav.advertisement.fuel],
          gearBox: GearBox[fav.advertisement.gearBox],
          km: fav.advertisement.km,
        },
      }),
    );

    return Maybe.some(mappedFavorites);
  }

  async findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity> {
    const favorite = await this.prismaService.favorite.findFirst({
      where: {
        advertisementId: advertisementId.toValue(),
        userId: userId.toValue(),
      },
    });

    if (!favorite) {
      return null;
    }

    return Maybe.some(FavoriteMappers.toDomain(favorite));
  }

  async delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.favorite.delete({
      where: {
        id: favoriteId.toValue(),
        userId: userId.toValue(),
      },
    });

    return Maybe.none();
  }
}
