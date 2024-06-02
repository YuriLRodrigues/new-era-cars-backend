import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type FindAllProps = {
  page: number;
  limit: number;
};

export type CreateProps = {
  image: ImageEntity;
};

export type DeleteProps = {
  imageId: UniqueEntityId;
};

export type SaveProps = {
  image: ImageEntity;
};

export type FindAllByAdvertisementIdProps = {
  advertisementId: UniqueEntityId;
};

export abstract class ImageRepository {
  abstract create({ image }: CreateProps): AsyncMaybe<ImageEntity>;
  abstract delete({ imageId }: DeleteProps): AsyncMaybe<void>;
  abstract save({ image }: SaveProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity>;
  abstract findAll({ limit, page }: FindAllProps): AsyncMaybe<ImageEntity[]>;
}
