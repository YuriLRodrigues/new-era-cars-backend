import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import {
  AdvertisementEntity,
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

import { AdvertisementImageRepository } from '../../repositories/advertisement-image.repository';
import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, AdvertisementEntity>;

type Input = {
  imagesIds: UniqueEntityId[];
  brandId: UniqueEntityId;
  capacity: Capacity;
  color: Color;
  description: string;
  doors: Doors;
  fuel: Fuel;
  gearBox: GearBox;
  km: number;
  localization: string;
  model: Model;
  phone: string;
  price: number;
  thumbnailImageId: UniqueEntityId;
  title: string;
  userId: UniqueEntityId;
  year: number;
  details?: string[];
};

@Injectable()
export class CreateAdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly advertisementImageRepository: AdvertisementImageRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(data: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: data.userId,
    });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    if (user.roles.includes(UserRoles.Customer)) {
      return left(new NotAllowedError());
    }

    const { value: thubnailImage, isNone: thubnailImageNotFound } = await this.imageRepository.findById({
      id: data.thumbnailImageId, // todo image id - concertar o thubnail id (ligação do prisma ad thumb)
    });

    if (thubnailImageNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const advertisement = AdvertisementEntity.create({
      brandId: data.brandId,
      capacity: data.capacity,
      color: data.color,
      description: data.description,
      doors: data.doors,
      fuel: data.fuel,
      gearBox: data.gearBox,
      km: data.km,
      localization: data.localization,
      model: data.model,
      phone: data.phone,
      price: data.price,
      thumbnailUrl: thubnailImage.url,
      title: data.title,
      userId: data.userId,
      year: data.year,
      details: data.details,
    });

    const advertisementImages = data.imagesIds.map((imgId) => {
      return AdvertisementImage.create({
        imageId: imgId,
        advertisementId: advertisement.id,
      });
    });

    Promise.all([
      await this.advertisementRepository.createAd({ advertisement }),

      await this.advertisementImageRepository.createMany({
        advertisementImages,
      }),
    ]);

    return right(advertisement);
  }
}
