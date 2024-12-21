import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import {
  AdvertisementEntity,
  Color,
  Fuel,
  Likes,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

export type FindAllAdsProps = {
  page: number;
  limit: number;
  search?: {
    model?: Model;
    fuel?: Fuel;
    color?: Color;
    year?: number;
    price?: number;
    brand?: string;
    km?: number;
    date?: 'asc' | 'desc';
    likes?: Likes;
  };
};

export type FindAllAdsByUserIdProps = {
  page: number;
  limit: number;
  userId: UniqueEntityId;
  search?: {
    title?: string;
    soldStatus?: SoldStatus;
    price?: number;
    sellerName?: string;
  };
};

export type FindAdByIdProps = {
  id: UniqueEntityId;
};

export type CreateAdProps = {
  advertisement: AdvertisementEntity;
};

export type DeleteAdProps = {
  advertisementId: UniqueEntityId;
};

export type SaveAdProps = {
  advertisement: AdvertisementEntity;
};

export type FindMetricsByUserId = {
  userId: UniqueEntityId;
};

export type FindAllSoldAds = {
  userId: UniqueEntityId;
  referenceDate: number;
};

export abstract class AdvertisementRepository {
  abstract findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity>;
  abstract findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails>;

  abstract createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity>;

  abstract deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void>;

  abstract saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void>;

  abstract findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>>;

  abstract findAllAdsByUserId({
    page,
    limit,
    search,
    userId,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>>;

  abstract findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
  }>;

  abstract findMetrics({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
  }>;

  abstract findAllSoldAds({ referenceDate, userId }: FindAllSoldAds): AsyncMaybe<
    {
      price: number;
      createdAt: Date;
    }[]
  >;
}
