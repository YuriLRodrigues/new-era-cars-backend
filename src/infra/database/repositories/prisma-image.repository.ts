import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
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

import { ImageMappers } from '../mappers/image.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaImageRepository implements ImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    const raw = await ImageMappers.toPersistence(image);

    await this.prismaService.image.create({
      data: raw,
    });

    return Maybe.some(image);
  }

  async delete({ imageId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.image.delete({
      where: {
        id: imageId.toValue(),
      },
    });

    return;
  }

  async save({ image }: SaveProps): AsyncMaybe<void> {
    const raw = ImageMappers.toPersistence(image);

    await this.prismaService.image.update({
      data: raw,
      where: {
        id: image.id.toValue(),
      },
    });

    return;
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity> {
    const image = await this.prismaService.image.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!image) {
      return Maybe.none();
    }

    const mappedImage = ImageMappers.toDomain(image);

    return Maybe.some(mappedImage);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<ImageEntity[]> {
    const images = await this.prismaService.image.findMany({
      take: limit,
      skip: page,
    });

    const mappedImages = images.map((img) =>
      ImageEntity.create(
        {
          url: img.url,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        },
        new UniqueEntityId(img.id),
      ),
    );

    const paginatedImages = mappedImages.slice((page - 1) * limit, page * limit);

    return Maybe.some(paginatedImages);
  }
}
