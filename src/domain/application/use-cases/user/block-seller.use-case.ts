import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<Error, void>;

type Input = {
  currentUserId: UniqueEntityId;
  sellerId: UniqueEntityId;
};

@Injectable()
export class BlockSellerUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ currentUserId, sellerId }: Input): Promise<Output> {
    const {
      value: { roles: userRoles },
    } = await this.userRepository.findById({
      id: currentUserId,
    });

    if (!userRoles.includes(UserRoles.Manager)) {
      return left(new Error('Invalid permission to block an seller'));
    }

    const { value: userExists, isNone: userNotFound } = await this.userRepository.findById({
      id: sellerId,
    });

    if (userNotFound()) {
      return left(new Error('User not found'));
    }

    userExists.revoked = new Date();

    await this.userRepository.save({ user: userExists });

    return right(null);
  }
}
