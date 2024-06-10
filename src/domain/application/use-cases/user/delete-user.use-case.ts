import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<Error, void>;

type Input = {
  currentUserId: UniqueEntityId;
  userId: UniqueEntityId;
};

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ currentUserId, userId }: Input): Promise<Output> {
    const { isNone: adminUserNotFound, value: adminUser } = await this.userRepository.findById({
      id: currentUserId,
    });

    if (adminUserNotFound() || !adminUser?.roles.includes(UserRoles.Manager)) {
      return left(new Error('Invalid permission to delete an user'));
    }

    const { isNone: userNotFound } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotFound()) {
      return left(new Error('User not found'));
    }

    await this.userRepository.delete({ userId });

    return right(null);
  }
}
