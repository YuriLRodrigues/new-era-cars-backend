import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@root/core/logic/Either';

import { Encrypter } from '../../cryptography/encrypter';
import { HashGenerator } from '../../cryptography/hash-generator';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  email: string;
  password: string;
};

type Output = Either<Error, string>;

@Injectable()
export class AuthorizationUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findByEmail({
      email,
    });

    if (userNotExists()) {
      return left(new Error('Invalid Wrong Credencials'));
    }

    const isPasswordCorrect = await this.hashGenerator.compare(password, user.password);

    if (!isPasswordCorrect) {
      return left(new Error('Invalid Wrong Credencials'));
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.toValue(),
      roles: user.roles,
    });

    return right(token);
  }
}
