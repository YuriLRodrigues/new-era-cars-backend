import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { QueryDataDTO } from '@root/infra/controller/advertisemet/dto/query-data.dto';

export type FindAllAdsByUserIdProps = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

export type FindAllAdsProps = {
  page: number;
  limit: number;
  search?: QueryDataDTO;
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

export abstract class AdvertisementRepository {
  abstract findAllAdsByUserId({
    userId,
    page,
    limit,
  }: FindAllAdsByUserIdProps): AsyncMaybe<MinimalAdvertisementDetails[]>;

  abstract findAllAds({ page, limit, search }: FindAllAdsProps): AsyncMaybe<MinimalAdvertisementDetails[]>;

  abstract findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity>;

  abstract createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity>;

  abstract deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void>;

  abstract saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void>;
}
