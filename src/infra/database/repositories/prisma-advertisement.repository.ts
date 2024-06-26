import { Injectable } from '@nestjs/common';
import { Color, Model } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AdvertisementRepository,
  CreateAdProps,
  DeleteAdProps,
  FindAdByIdProps,
  FindAllAdsByUserIdProps,
  FindAllAdsProps,
  FindAllAdvertisementsProps,
  SaveAdProps,
} from '@root/domain/application/repositories/advertisement.repository';
import {
  AdvertisementEntity,
  Capacity,
  Doors,
  Fuel,
  GearBox,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

import { AdvertisementMappers } from '../mappers/advertisement.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdvertisementRepository implements AdvertisementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    const raw = AdvertisementMappers.toPersistence(advertisement);

    const ad = await this.prismaService.advertisement.create({
      data: raw,
    });

    const mappedAd = AdvertisementMappers.toDomain(ad);

    return Maybe.some(mappedAd);
  }

  async findAllAdsByUserId({ userId, page, limit }: FindAllAdsByUserIdProps): AsyncMaybe<FindAllAdvertisementsProps> {
    const ads = await this.prismaService.advertisement.findMany({
      where: { userId: userId.toValue() },
      skip: page,
      take: limit,
      select: {
        brand: {
          select: {
            name: true,
            logoUrl: true,
            id: true,
          },
        },
        km: true,
        price: true,
        title: true,
        capacity: true,
        doors: true,
        fuel: true,
        gearBox: true,
        id: true,
        thumbnailUrl: true,
      },
    });

    const totalPages = await this.prismaService.advertisement.count({
      where: { userId: userId.toValue() },
    });

    const selectedAds = ads.map((ad) =>
      MinimalAdvertisementDetails.create({
        advertisementId: new UniqueEntityId(ad.id),
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: Capacity[ad.capacity],
        doors: Doors[ad.doors],
        fuel: Fuel[ad.fuel],
        gearBox: GearBox[ad.gearBox],
        thumbnailUrl: ad.thumbnailUrl,
        brand: {
          brandId: new UniqueEntityId(ad.brand.id),
          imageUrl: ad.brand.logoUrl,
          name: ad.brand.name,
        },
      }),
    );

    return Maybe.some({ data: selectedAds, totalPages });
  }

  async findAllAds({ page, limit, search }: FindAllAdsProps): AsyncMaybe<FindAllAdvertisementsProps> {
    const ads = await this.prismaService.advertisement.findMany({
      skip: page,
      take: limit,
      where: {
        brand: {
          name: search.brand || undefined,
        },
        fuel: Fuel[search.fuel] || undefined,
        color: Color[search.color] || undefined,
        model: Model[search.model] || undefined,
        year: search.year || undefined,
        km: search.km || undefined,
        price: search.price || undefined,
      },
      orderBy: {
        likes: {
          _count: search.likes || undefined,
        },
        createdAt: search.data || undefined,
      },
      select: {
        brand: {
          select: {
            name: true,
            logoUrl: true,
            id: true,
          },
        },
        km: true,
        price: true,
        title: true,
        capacity: true,
        doors: true,
        fuel: true,
        gearBox: true,
        id: true,
        thumbnailUrl: true,
      },
    });

    const totalPages = await this.prismaService.advertisement.count();

    const selectedAds = ads.map((ad) =>
      MinimalAdvertisementDetails.create({
        advertisementId: new UniqueEntityId(ad.id),
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: Capacity[ad.capacity],
        doors: Doors[ad.doors],
        fuel: Fuel[ad.fuel],
        gearBox: GearBox[ad.gearBox],
        thumbnailUrl: ad.thumbnailUrl,
        brand: {
          brandId: new UniqueEntityId(ad.brand.id),
          imageUrl: ad.brand.logoUrl,
          name: ad.brand.name,
        },
      }),
    );

    return Maybe.some({ data: selectedAds, totalPages });
  }

  async findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity> {
    const ad = await this.prismaService.advertisement.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!ad) {
      return Maybe.none();
    }

    const mappedAd = AdvertisementMappers.toDomain(ad);

    return Maybe.some(mappedAd);
  }

  async deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void> {
    await this.prismaService.advertisement.delete({
      where: {
        id: advertisementId.toValue(),
      },
    });

    return;
  }

  async saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void> {
    const raw = AdvertisementMappers.toPersistence(advertisement);

    await this.prismaService.advertisement.update({
      data: raw,
      where: {
        id: advertisement.id.toValue(),
      },
    });

    return;
  }
}
