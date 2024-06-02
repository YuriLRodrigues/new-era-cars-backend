import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<Error, MinimalAdvertisementDetails[]>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

@Injectable()
export class FindAllAdsByUserIdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, limit, page }: Input): Promise<Output> {
    const { isNone, value: user } = await this.userRepository.findById({ id: userId });

    if (isNone()) {
      return left(new Error('User not found'));
    }

    const { value: advertisement } = await this.advertisementRepository.findAllAdsByUserId({
      userId: user.id,
      limit,
      page,
    });

    return right(advertisement);
  }
}
