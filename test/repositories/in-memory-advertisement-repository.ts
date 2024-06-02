import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AdvertisementRepository,
  CreateAdProps,
  DeleteAdProps,
  FindAdByIdProps,
  FindAllAdsByUserIdProps,
  FindAllAdsProps,
  SaveAdProps,
} from '@root/domain/application/repositories/advertisement.repository';
import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

import { InMemoryBrandRepository } from './in-memory-brand-repository';

export class InMemoryAdvertisementRepository implements AdvertisementRepository {
  constructor(private readonly inMemoryBrandRepository: InMemoryBrandRepository) {}

  public advertisements: AdvertisementEntity[] = [];

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    this.advertisements.push(advertisement);

    return Maybe.some(advertisement);
  }

  async findAllAdsByUserId({
    userId,
    page,
    limit,
  }: FindAllAdsByUserIdProps): AsyncMaybe<MinimalAdvertisementDetails[]> {
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

    return Maybe.some(advertisementsPaginated);
  }

  async findAllAds({ page, limit, search }: FindAllAdsProps): AsyncMaybe<MinimalAdvertisementDetails[]> {
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

    const minimalData = filteredData.map((ad) => {
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

    const advertisementsPaginated = minimalData
      .filter((ad) => {
        if (search?.brand && ad.brand.name !== search?.brand) return false;

        return true;
      })
      .slice((page - 1) * limit, limit * page);

    return Maybe.some(advertisementsPaginated);
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
