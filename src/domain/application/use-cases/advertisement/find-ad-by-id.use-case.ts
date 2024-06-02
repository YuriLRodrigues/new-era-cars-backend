import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';

type Output = Either<Error, AdvertisementEntity>;

type Input = {
  id: UniqueEntityId;
};

@Injectable()
export class FindAdByIdUseCase {
  constructor(private readonly advertisementRepository: AdvertisementRepository) {}

  async execute({ id }: Input): Promise<Output> {
    const { value: advertisement, isNone } = await this.advertisementRepository.findAdById({
      id,
    });

    if (isNone()) {
      return left(new Error('Advertisement not found'));
    }

    return right(advertisement);
  }
}
