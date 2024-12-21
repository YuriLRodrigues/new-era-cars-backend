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
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

import { InMemoryAddressRepository } from './in-memory-address-repository';
import { InMemoryBrandRepository } from './in-memory-brand-repository';
import { InMemoryImageRepository } from './in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from './in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from './in-memory-user-repository';

export class InMemoryAdvertisementRepository implements AdvertisementRepository {
  constructor(
    private readonly inMemoryBrandRepository: InMemoryBrandRepository,
    private readonly inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository,
    private readonly inMemoryUserRepository: InMemoryUserRepository,
    private readonly inMemoryImageRepository: InMemoryImageRepository,
    private readonly inMemoryAddressRepository: InMemoryAddressRepository,
  ) {}

  public advertisements: AdvertisementEntity[] = [];

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    this.advertisements.push(advertisement);

    return Maybe.some(advertisement);
  }

  async findAllAdsByUserId({
    userId,
    page,
    limit,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>> {
    const user = await this.inMemoryUserRepository.users.find((user) => user.id.toValue() === userId.toValue());

    const advertisements = await this.advertisements.filter((ad) => ad.userId.toValue() === userId.toValue());

    const minimalData = advertisements.map((ad) => {
      return UserAdvertisements.create({
        advertisement: {
          createdAt: ad.createdAt,
          id: ad.id,
          price: ad.price,
          soldStatus: ad.soldStatus,
          title: ad.title,
          salePrice: ad.salePrice,
        },
        user: {
          id: user.id,
          profileImg: user.avatar,
          username: user.username,
        },
      });
    });

    const advertisementsPaginated = minimalData.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: advertisementsPaginated,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(minimalData.length / limit),
        totalCount: minimalData.length,
      },
    });
  }

  async findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>> {
    const filteredData = this.advertisements.filter((ad) => {
      if (search?.color && ad.color !== search.color) return false;

      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

      if (!brand) return false;

      if (search?.brand && brand.name !== search?.brand) return false;

      if (search?.fuel && ad.fuel !== search?.fuel) return false;

      if (search?.km && ad.km > +search?.km) return false;

      if (search?.model && ad.model !== search?.model) return false;

      if (search?.price && ad.price > +search?.price) return false;

      if (search?.color && ad.color !== search?.color) return false;

      if (search?.year && ad.year !== +search?.year) return false;

      return true;
    });

    const sortedData = filteredData.sort((a, b) => {
      if (search?.date.includes('asc')) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      if (search?.date.includes('desc')) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return;
    });

    const minimalData = sortedData.map((ad) => {
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

      const likes = this.inMemoryLikeAdvertisementRepository.advertisementLikes.filter((adLike) =>
        ad.id.equals(adLike.id),
      );

      return MinimalAdvertisementDetails.create({
        advertisementId: ad.id,
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: ad.capacity,
        doors: ad.doors,
        fuel: ad.fuel,
        gearBox: ad.gearBox,
        brand: {
          brandId: brand.id,
          imageUrl: brand.logoUrl,
          name: brand.name,
        },
        thumbnailUrl: ad.thumbnailUrl,
        likes,
      });
    });

    const sortedLikes = minimalData.sort((a, b) => {
      if (search?.date.includes('asc')) return a.likes.length - b.likes.length;

      if (search?.date.includes('desc')) return b.likes.length - a.likes.length;

      return;
    });

    const advertisementsPaginated = sortedLikes
      .filter((ad) => {
        if (search?.brand && ad.brand.name !== search?.brand) return false;

        return true;
      })
      .slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: advertisementsPaginated,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(minimalData.length / limit) || 0,
        totalCount: minimalData.length,
      },
    });
  }

  async findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity> {
    const ad = this.advertisements.find((ad) => ad.id === id);

    if (!ad) return Maybe.none();

    const adDetails = AdvertisementEntity.create(
      {
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: Capacity[ad.capacity],
        doors: Doors[ad.doors],
        fuel: Fuel[ad.fuel],
        gearBox: GearBox[ad.gearBox],
        color: Color[ad.color],
        model: Model[ad.model],
        soldStatus: ad.soldStatus,
        salePrice: ad.salePrice,
        year: ad.year,
        description: ad.description,
        details: ad.details,
        phone: ad.phone,
        localization: ad.localization,
        brandId: ad.brandId,
        thumbnailUrl: ad.thumbnailUrl,
        userId: ad.userId,
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
      },
      ad.id,
    );

    return Maybe.some(adDetails);
  }

  async findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails> {
    const ad = this.advertisements.find((ad) => ad.id === id);

    if (!ad) return Maybe.none();

    const { value: user } = await this.inMemoryUserRepository.findById({ id: ad.userId });

    if (!user) return Maybe.none();

    const { value: address } = await this.inMemoryAddressRepository.findByUserId({ id: user.id });

    if (!address) return Maybe.none();

    const { value: brand } = await this.inMemoryBrandRepository.findById({ id: ad.brandId });

    if (!brand) return Maybe.none();

    const { value: images } = await this.inMemoryImageRepository.findManyByAdId({ id: ad.id });

    const adDetails = AdvertisementDetails.create({
      title: ad.title,
      price: ad.price,
      km: ad.km,
      capacity: Capacity[ad.capacity],
      doors: Doors[ad.doors],
      fuel: Fuel[ad.fuel],
      gearBox: GearBox[ad.gearBox],
      color: Color[ad.color],
      model: Model[ad.model],
      soldStatus: ad.soldStatus,
      salePrice: ad.salePrice,
      year: ad.year,
      description: ad.description,
      details: ad.details,
      phone: ad.phone,
      localization: ad.localization,
      brand: {
        brandId: brand.id,
        imageUrl: brand.logoUrl,
        name: brand.name,
      },
      images: images,
      user: {
        id: user.id,
        name: user.name,
        address: {
          street: address.street,
          city: address.city,
          zipCode: address.zipCode,
        },
      },
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    });

    return Maybe.some(adDetails);
  }

  async findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
  }> {
    const user = await this.inMemoryUserRepository.findById({ id: userId });

    if (!user) return Maybe.none();

    const activesAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Active',
    ).length;

    const reservedAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Reserved',
    ).length;

    const soldAdvertisements = this.advertisements.filter(
      (ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === userId.toValue(),
    ).length;

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
    const user = await this.inMemoryUserRepository.findById({ id: userId });

    if (!user) return Maybe.none();

    const activesAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Active',
    ).length;

    const reservedAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Reserved',
    ).length;

    const soldAdvertisements = this.advertisements.filter(
      (ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === userId.toValue(),
    ).length;

    const totalSellers = this.inMemoryUserRepository.users.filter((user) =>
      user.roles.includes(UserRoles.Seller),
    ).length;

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
    const soldAds = this.advertisements.filter((ad) => ad.soldStatus === 'Sold' && ad.userId.equals(userId));

    const filteredAds = soldAds.filter((ad) => new Date(ad.createdAt).getMonth() === referenceDate - 1);

    const mappedAds = filteredAds.map((ad) => {
      return {
        price: ad.salePrice || ad.price,
        createdAt: ad.createdAt,
      };
    });

    return Maybe.some(mappedAds);
  }

  async deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void> {
    this.advertisements = this.advertisements.filter((ad) => !ad.id.equals(advertisementId));

    return;
  }

  async saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void> {
    const index = this.advertisements.findIndex((ad) => ad.id.equals(advertisement.id));
    this.advertisements[index] = advertisement;

    return;
  }
}
