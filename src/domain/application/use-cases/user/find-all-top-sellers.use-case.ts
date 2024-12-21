import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Either, right } from '@root/core/logic/Either';
import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<Error, PaginatedResult<TopSellerDetails[]>>;

type Input = {
  page: number;
  limit: number;
};

@Injectable()
export class FindAllTopSellersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const { value: advertisements } = await this.userRepository.findAllTopSellers({
      limit,
      page,
    });

    return right(advertisements);
  }
}
