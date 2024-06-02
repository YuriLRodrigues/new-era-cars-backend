import { Either, right } from '@root/core/logic/Either';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { BrandRepository } from '../../repositories/brand.repository';

type Input = {
  page: number;
  limit: number;
};

type Output = Either<Error, BrandEntity[]>;

export class FindAllBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const { value: brands } = await this.brandRepository.findAll({ limit, page });

    return right(brands);
  }
}
