import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<Error, UserEntity>;

type Input = {
  id: UniqueEntityId;
  username?: string;
  avatar?: string;
  name?: string;
  role?: UserRoles;
};

@Injectable()
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ username, avatar, name, id, role }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id });

    if (userNotFound()) {
      return left(new Error('User not found'));
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
