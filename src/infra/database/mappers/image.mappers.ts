import { Image, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export class ImageMappers {
  static toDomain(data: Image): ImageEntity {
    return ImageEntity.create(
      {
        url: data.url,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: ImageEntity): Prisma.ImageCreateInput {
    return {
      url: data.url,
      id: data.id.toValue(),
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    };
  }
}
