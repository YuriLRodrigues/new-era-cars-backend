import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
  km?: number;
  localization?: string;
  phone?: string;
  title?: string;
  thumbnailUrl?: string;
  description?: string;
  year?: number;
  details?: string[];
  brandId?: UniqueEntityId;
  doors?: Doors;
  model?: Model;
  color?: Color;
  price?: number;
  soldStatus?: SoldStatus;
  salePrice?: number;
  gearBox?: GearBox;
  fuel?: Fuel;
  capacity?: Capacity;
  updatedAt?: Date;
};

type Output = Either<Error, null>;

@Injectable()
export class UpdateAdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    id,
    userId,
    brandId,
    capacity,
    color,
    description,
    details,
    doors,
    fuel,
    gearBox,
    km,
    localization,
    model,
    phone,
    price,
    salePrice,
    thumbnailUrl,
    title,
    updatedAt,
    soldStatus,
    year,
  }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) {
      return left(new Error('User not found'));
    }

    const { isNone: adNotFound, value: advertisement } = await this.advertisementRepository.findAdById({
      id,
    });

    if (adNotFound()) {
      return left(new Error('Ad not found'));
    }

    if (
      (user.roles.includes(UserRoles.Seller) && advertisement.userId !== user.id) ||
      (!user.roles.includes(UserRoles.Manager) && advertisement.userId !== user.id)
    ) {
      return left(new Error('You do not have permission to update this ad'));
    }

    advertisement.editInfo({
      brandId,
      capacity,
      color,
      description,
      details,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      phone,
      price,
      salePrice,
      thumbnailUrl,
      title,
      updatedAt,
      soldStatus,
      year,
    });

    await this.advertisementRepository.saveAd({ advertisement });

    return right(null);
  }
}
