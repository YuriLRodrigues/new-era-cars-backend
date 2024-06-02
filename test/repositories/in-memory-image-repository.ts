import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  DeleteProps,
  FindAllProps,
  FindByIdProps,
  ImageRepository,
  SaveProps,
} from '@root/domain/application/repositories/image.repository';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export class InMemoryImageRepository implements ImageRepository {
  public images: ImageEntity[] = [];

  async create({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    this.images.push(image);

    return Maybe.some(image);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity> {
    const image = this.images.find((image) => image.id.equals(id));

    if (!image) {
      return Maybe.none();
    }

    return Maybe.some(image);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<ImageEntity[]> {
    const images = this.images.slice((page - 1) * limit, limit * page);

    return Maybe.some(images);
  }

  async delete({ imageId }: DeleteProps): AsyncMaybe<void> {
    this.images = this.images.filter((image) => !image.id.equals(imageId));

    return;
  }

  async save({ image }: SaveProps): AsyncMaybe<void> {
    const index = this.images.findIndex((img) => img.id.equals(image.id));

    this.images[index] = image;

    return;
  }
}
