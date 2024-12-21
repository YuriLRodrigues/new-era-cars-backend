import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AdvertisementRepository,
  CreateAdProps,
  DeleteAdProps,
  FindAdByIdProps,
  FindAllAdsByUserIdProps,
  FindAllAdsProps,
  FindAllSoldAds,
  FindMetricsByUserId,
  SaveAdProps,
} from '@root/domain/application/repositories/advertisement.repository';
import {
  AdvertisementEntity,
  Capacity,
  Doors,
  Color,
  Model,
  Fuel,
  GearBox,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';
import dayjs from 'dayjs';

import { AdvertisementMappers } from '../mappers/advertisement.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdvertisementRepository implements AdvertisementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllAdsByUserId({
    page,
    limit,
    userId,
    search,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        where: {
          userId: userId.toValue(),
          title: search?.title || undefined,
          soldStatus: search?.soldStatus || undefined,
          price: search?.price || undefined,
          user: {
            name: search?.sellerName || undefined,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          createdAt: true,
          id: true,
          price: true,
          soldStatus: true,
          title: true,
          salePrice: true,
          user: {
            select: {
              name: true,
              avatar: true,
              id: true,
            },
          },
        },
      }),
      this.prismaService.advertisement.count({
        where: { userId: userId.toValue() },
      }),
    ]);

    const selectedAds = ads.map((ad) =>
      UserAdvertisements.create({
        advertisement: {
          createdAt: ad.createdAt,
          id: new UniqueEntityId(ad.id),
          price: ad.price,
          soldStatus: SoldStatus[ad.soldStatus],
          title: ad.title,
          salePrice: ad.salePrice || null,
        },
        user: {
          id: new UniqueEntityId(ad.user.id),
          profileImg: ad.user.avatar,

          username: ad.user.name,
        },
      }),
    );

    return Maybe.some({
      data: selectedAds,
      meta: { page, perPage: limit, totalCount: count, totalPages: Math.ceil(count / limit) },
    });
  }

  async findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
  }> {
    const [activesAdvertisements, reservedAdvertisements, soldAdvertisements] = await this.prismaService.$transaction([
      this.prismaService.advertisement.count({
        where: {
          userId: userId.toValue(),
          soldStatus: SoldStatus.Active,
        },
      }),
      this.prismaService.advertisement.count({
        where: {
          userId: userId.toValue(),
          soldStatus: SoldStatus.Reserved,
        },
      }),
      this.prismaService.advertisement.count({
        where: {
          userId: userId.toValue(),
          soldStatus: SoldStatus.Sold,
        },
      }),
    ]);

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
    });
  }

  async findMetrics({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
  }> {
    const [activesAdvertisements, reservedAdvertisements, soldAdvertisements, totalSellers] =
      await this.prismaService.$transaction([
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Active,
          },
        }),
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Reserved,
          },
        }),
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Sold,
          },
        }),
        this.prismaService.user.count({
          where: {
            roles: {
              hasSome: [UserRoles.Seller],
            },
          },
        }),
      ]);

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalSellers,
    });
  }

  async findAllSoldAds({ referenceDate, userId }: FindAllSoldAds): AsyncMaybe<
    {
      price: number;
      createdAt: Date;
    }[]
  > {
    const date = dayjs(`${dayjs().year()}-${referenceDate - 1}-01`);
    const monthStart = date.startOf('month').toDate();
    const monthEnd = date.endOf('month').toDate();

    const soldAds = await this.prismaService.advertisement.findMany({
      where: {
        userId: userId.toValue(),
        soldStatus: SoldStatus.Sold,
        createdAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      select: {
        createdAt: true,
        price: true,
      },
    });

    return Maybe.some(soldAds);
  }

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    const raw = AdvertisementMappers.toPersistence(advertisement);

    const ad = await this.prismaService.advertisement.create({
      data: raw,
    });

    const mappedAd = AdvertisementMappers.toDomain(ad);

    return Maybe.some(mappedAd);
  }

  async findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        skip: (page - 1) * limit,
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
          createdAt: search.date || undefined,
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
      }),
      this.prismaService.advertisement.count(),
    ]);

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

    return Maybe.some({
      data: selectedAds,
      meta: {
        page: page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
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
  async findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails> {
    const ad = await this.prismaService.advertisement.findFirst({
      where: {
        id: id.toValue(),
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
        localization: true,
        phone: true,
        year: true,
        description: true,
        details: true,
        color: true,
        model: true,
        soldStatus: true,
        salePrice: true,
        user: {
          select: {
            id: true,
            name: true,
            address: {
              select: {
                city: true,
                street: true,
                zipCode: true,
              },
            },
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!ad) {
      return Maybe.none();
    }

    const mappedAd = AdvertisementDetails.create({
      title: ad.title,
      price: ad.price,
      km: ad.km,
      capacity: Capacity[ad.capacity],
      doors: Doors[ad.doors],
      fuel: Fuel[ad.fuel],
      gearBox: GearBox[ad.gearBox],
      brand: {
        brandId: new UniqueEntityId(ad.brand.id),
        imageUrl: ad.brand.logoUrl,
        name: ad.brand.name,
      },
      localization: ad.localization,
      phone: ad.phone,
      year: ad.year,
      description: ad.description,
      details: ad.details,
      color: Color[ad.color],
      model: Model[ad.model],
      soldStatus: SoldStatus[ad.soldStatus],
      salePrice: ad.salePrice,
      user: {
        id: new UniqueEntityId(ad.user.id),
        name: ad.user.name,
        address: {
          city: ad.user.address.city,
          street: ad.user.address.street,
          zipCode: ad.user.address.zipCode,
        },
      },
      images: ad.images,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    });

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
