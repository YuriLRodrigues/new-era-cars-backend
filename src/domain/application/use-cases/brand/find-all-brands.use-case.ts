import { Either, right } from '@root/core/logic/Either';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { BrandRepository } from '../../repositories/brand.repository';

type Output = Either<Error, BrandEntity[]>;

export class FindAllBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(): Promise<Output> {
    const { value: brands } = await this.brandRepository.findAll();

    return right(brands);
  }
}
