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
import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

import { InMemoryBrandRepository } from './in-memory-brand-repository';
import { InMemoryLikeAdvertisementRepository } from './in-memory-like-advertisement-repository';

export class InMemoryAdvertisementRepository implements AdvertisementRepository {
  constructor(
    private readonly inMemoryBrandRepository: InMemoryBrandRepository,
    private readonly inMemoryLikeRepository: InMemoryLikeAdvertisementRepository,
  ) {}
  findAllActiveCount: any;
  findAllReservedCount: any;
  findAllSellCount: any;
  findAllSellers: any;
  findTopSellers: any;

  public advertisements: AdvertisementEntity[] = [];

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    this.advertisements.push(advertisement);

    return Maybe.some(advertisement);
  }

  async findAllAdsByUserId({ userId, page, limit }: FindAllAdsByUserIdProps): AsyncMaybe<FindAllAdvertisementsProps> {
    const advertisements = await this.advertisements.filter((ad) => ad.userId.toValue() === userId.toValue());

    const minimalData = advertisements.map((ad) => {
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

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
      });
    });

    const advertisementsPaginated = minimalData.slice((page - 1) * limit, limit * page);

    return Maybe.some({ data: advertisementsPaginated, totalPages: Math.ceil(minimalData.length / 30) });
  }

  async findAllAds({ page, limit, search }: FindAllAdsProps): AsyncMaybe<FindAllAdvertisementsProps> {
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
      if (search?.data.includes('asc')) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      if (search?.data.includes('desc')) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return;
    });

    const minimalData = sortedData.map((ad) => {
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));
      const likes = this.inMemoryLikeRepository.advertisementLikes.filter((adLike) => ad.id.equals(adLike.id));

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
      if (search?.data.includes('asc')) return a.likes.length - b.likes.length;

      if (search?.data.includes('desc')) return b.likes.length - a.likes.length;

      return;
    });

    const advertisementsPaginated = sortedLikes
      .filter((ad) => {
        if (search?.brand && ad.brand.name !== search?.brand) return false;

        return true;
      })
      .slice((page - 1) * limit, limit * page);

    return Maybe.some({ data: advertisementsPaginated, totalPages: Math.ceil(minimalData.length / 30) });
  }

  async findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity> {
    const ad = this.advertisements.find((ad) => ad.id === id);

    if (!ad) return Maybe.none();

    return Maybe.some(ad);
  }

  async deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void> {
    this.advertisements = this.advertisements.filter((ad) => !ad.id.equals(advertisementId));

    return;
  }

  async saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void> {
    const index = this.advertisements.findIndex((ad) => ad.id === advertisement.id);
    this.advertisements[index] = advertisement;

    return;
  }
}
