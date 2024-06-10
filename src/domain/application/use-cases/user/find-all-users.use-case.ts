import { Injectable } from '@nestjs/common';
import { Either, right } from '@root/core/logic/Either';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Input = {
  limit?: number;
  page?: number;
};

type Output = Either<Error, UserEntity[]>;

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const { value: users } = await this.userRepository.findAllUsers({ limit: limit ?? 10, page: page ?? 1 });

    return right(users);
  }
}
