import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { FakeHash } from 'test/cryptography';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { RegisterUserUseCase } from './register-user.use-case';

describe('Register User - Use Case', () => {
  let sut: RegisterUserUseCase;
  let inMemoryUserRepository: InMemoryUserRepository;

  const user = UserEntity.create({
    avatar: 'Avatar 1',
    username: 'testUser',
    email: 'emailtest@example.com',
    name: 'TestUser',
    password: 'password',
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    const fakeHash = new FakeHash();
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHash);
  });

  it('should be able to register a new user', async () => {
    const output = await sut.execute({
      avatar: 'Avatar 1',
      username: 'john',
      email: 'email@example.com',
      name: 'John',
      password: 'password',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(UserEntity);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(output.value).toEqual(
      expect.objectContaining({
        avatar: 'Avatar 1',
        username: 'john',
        email: 'email@example.com',
        name: 'John',
        password: 'password-hashed',
        roles: expect.arrayContaining(['Customer']),
      }),
    );
  });

  it('should not be able to register a new user with an existing email or username', async () => {
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      avatar: 'Avatar 1',
      username: 'testUser',
      email: 'emailtest@example.com',
      name: 'TestUser',
      password: 'password',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).not.toBeInstanceOf(UserEntity);
    expect(output.value).toEqual(new Error('User already exists'));
  });
});
