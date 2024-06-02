import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

type Overwrides = Partial<ImageEntity>;

export const makeFakeImage = (data = {} as Overwrides) => {
  const id = new UniqueEntityId();
  const url = faker.internet.url();
  const createdAt = faker.date.past();
  const updatedAt = faker.date.recent();

  return ImageEntity.create(
    {
      url: data.url || url,
      advertisementImageId: data.advertisementImageId ?? null,
      advertisementThumbnailId: data.advertisementThumbnailId ?? null,
      createdAt: data.createdAt || createdAt,
      updatedAt: data.updatedAt || updatedAt,
    },
    data.id || id,
  );
};
