import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import {
  AdvertisementEntity,
  Color,
  Date,
  Fuel,
  Likes,
  Model,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

export type FindAllAdsByUserIdProps = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

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
    data?: Date;
    likes?: Likes;
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

export type FindAllAdvertisementsProps = {
  data: MinimalAdvertisementDetails[];
  totalPages: number;
};

export abstract class AdvertisementRepository {
  abstract findAllAdsByUserId({ userId, page, limit }: FindAllAdsByUserIdProps): AsyncMaybe<FindAllAdvertisementsProps>;

  abstract findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity>;

  abstract createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity>;

  abstract deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void>;

  abstract saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void>;

  abstract findAllAds({ page, limit, search }: FindAllAdsProps): AsyncMaybe<FindAllAdvertisementsProps>; // arrumar e passar o filtro de data decres/nome decres/preço decres/pesquisar

  abstract findAllActiveCount;

  abstract findAllReservedCount;

  abstract findAllSellCount; // pode receber um parametro pra filtrar por uma data/mes

  abstract findAllSellers;

  abstract findTopSellers;
}
