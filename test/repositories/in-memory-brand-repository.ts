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

export class InMemoryBrandRepository implements BrandRepository {
  public brands: BrandEntity[] = [];

  async create({ brand }: CreateProps): AsyncMaybe<BrandEntity> {
    this.brands.push(brand);

    return Maybe.some(brand);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<BrandEntity> {
    const brand = await this.brands.find((brand) => brand.id.equals(id));

    if (!brand) {
      return Maybe.none();
    }

    return Maybe.some(brand);
  }

  async findByName({ name }: FindByNameProps): AsyncMaybe<BrandEntity> {
    const brand = await this.brands.find((brand) => brand.name === name);

    if (!brand) {
      return Maybe.none();
    }

    return Maybe.some(brand);
  }

  async findAll(): AsyncMaybe<BrandEntity[]> {
    const brands = await this.brands;

    return Maybe.some(brands);
  }

  async delete({ brandId }: DeleteProps): AsyncMaybe<void> {
    this.brands = this.brands.filter((brand) => !brand.id.equals(brandId));

    return;
  }

  async save({ brand }: SaveProps): AsyncMaybe<void> {
    const index = this.brands.findIndex((brand) => brand.id.equals(brand.id));

    this.brands[index] = brand;

    return;
  }
}
