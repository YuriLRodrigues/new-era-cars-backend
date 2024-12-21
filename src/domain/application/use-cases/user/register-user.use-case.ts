import { Injectable } from '@nestjs/common';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { HashGenerator } from '../../cryptography/hash-generator';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceAlreadyExistsError, UserEntity>;

type Input = {
  email: string;
  avatar: string;
  name: string;
  username: string;
  password: string;
  role?: UserRoles;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({ email, avatar, role, name, username, password }: Input): Promise<Output> {
    const { isSome: userEmailExists } = await this.userRepository.findByEmail({ email });

    if (userEmailExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const { isSome: userUsernameExists } = await this.userRepository.findByUsername({ username });

    if (userUsernameExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = UserEntity.create({
      avatar,
      email,
      name,
      password: hashedPassword,
      username,
      roles: [role ?? UserRoles.Customer],
    });

    const { value: userSaved } = await this.userRepository.register({ user });

    return right(userSaved);
  }
}
