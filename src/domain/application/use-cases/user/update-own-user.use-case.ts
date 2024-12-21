import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, UserEntity>;

type Input = {
  id: UniqueEntityId;
  username?: string;
  avatar?: string;
  name?: string;
  role?: UserRoles;
};

@Injectable()
export class UpdateOwnUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ username, avatar, name, id, role }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    if (role && !user.roles.includes(role)) {
      user.roles = [role];
    }

    user.editInfo({
      avatar,
      name,
      username,
    });

    await this.userRepository.save({ user: user });

    return right(user);
  }
}
