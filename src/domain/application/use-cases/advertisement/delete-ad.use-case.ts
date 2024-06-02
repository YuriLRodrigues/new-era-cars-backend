import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<Error, void>;

@Injectable()
export class DeleteAdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRespository: UserRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRespository.findById({ id: userId });

    if (userNotFound()) {
      return left(new Error('User not found'));
    }

    const { isNone: adNotExists, value: advertisement } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (adNotExists()) {
      return left(new Error('Advertisement not found'));
    }

    if (user.id !== advertisement.userId && !user.roles.includes(UserRoles.Manager)) {
      return left(new Error('You do not have permission to delete this ad'));
    }

    await this.advertisementRepository.deleteAd({ advertisementId });

    return right(null);
  }
}
