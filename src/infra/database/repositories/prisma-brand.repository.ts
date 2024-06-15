import { Injectable } from '@nestjs/common';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  BrandRepository,
  CreateProps,
  DeleteProps,
  FindByIdProps,
  FindByNameProps,
  SaveProps,
} from '@root/domain/application/repositories/brand.repository';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { BrandMappers } from '../mappers/brand.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ brand }: CreateProps): AsyncMaybe<BrandEntity> {
    const raw = BrandMappers.toPersistence(brand);

    await this.prismaService.brand.create({
      data: raw,
    });

    return Maybe.some(brand);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<BrandEntity> {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!brand) {
      return Maybe.none();
    }

    const mappedBrand = BrandMappers.toDomain(brand);

    return Maybe.some(mappedBrand);
  }

  async findByName({ name }: FindByNameProps): AsyncMaybe<BrandEntity> {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        name,
      },
    });

    if (!brand) {
      return Maybe.none();
    }

    const mappedBrand = BrandMappers.toDomain(brand);

    return Maybe.some(mappedBrand);
  }

  async save({ brand }: SaveProps): AsyncMaybe<void> {
    const raw = BrandMappers.toPersistence(brand);

    await this.prismaService.brand.update({
      data: raw,
      where: {
        id: brand.id.toValue(),
      },
    });

    return;
  }

  async findAll(): AsyncMaybe<BrandEntity[]> {
    const brands = await this.prismaService.brand.findMany();

    const mappedBrands = brands.map((brand) => BrandMappers.toDomain(brand));

    return Maybe.some(mappedBrands);
  }

  async delete({ brandId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.brand.delete({
      where: {
        id: brandId.toValue(),
      },
    });

    return;
  }
}
