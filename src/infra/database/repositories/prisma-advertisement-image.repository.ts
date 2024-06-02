import { Injectable } from '@nestjs/common';
import {
  AdvertisementImageRepository,
  CreateManyProps,
} from '@root/domain/application/repositories/advertisement-image.repository';

import { AdvertisementImageMappers } from '../mappers/advertisement-image.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdvertisementImageRepository implements AdvertisementImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany({ advertisementImages }: CreateManyProps): Promise<void> {
    const raw = AdvertisementImageMappers.toManyPersistence(advertisementImages);

    await this.prismaService.image.updateMany(raw);

    return;
  }
}
