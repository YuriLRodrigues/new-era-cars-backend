import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { FakeHash } from 'test/cryptography';
import { FakeEncrypter } from 'test/encrypter';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { Encrypter } from '../../cryptography/encrypter';
import { AuthorizationUserUseCase } from './authorization-user.use-case';

describe('Authorization User - Use Case', () => {
  let sut: AuthorizationUserUseCase;
  let inMemoryUserRepository: InMemoryUserRepository;
  let fakeHash: FakeHash;
  let fakeCryptography: Encrypter;

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHash = new FakeHash();
    fakeCryptography = new FakeEncrypter();

    sut = new AuthorizationUserUseCase(inMemoryUserRepository, fakeHash, fakeCryptography);

    const user = UserEntity.create(
      {
        avatar: 'Avatar 1',
        username: 'testUser',
        email: 'emailtest@example.com',
        name: 'TestUser',
        password: 'password',
      },
      new UniqueEntityId('123'),
    );

    inMemoryUserRepository.register({ user });
  });

  it('should be able to authorize the user to log in to the application and return the token', async () => {
    const output = await sut.execute({
      email: 'emailtest@example.com',
      password: 'password',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(JSON.stringify({ sub: '123', roles: [UserRoles.Customer] }));
  });

  it('should not be able to authorize the user to log in to the application with invalid email or password and should return the authorization error', async () => {
    const output = await sut.execute({
      email: 'invalid-email-test@example.com',
      password: 'invalid-password',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Invalid Wrong Credencials'));
  });
});
