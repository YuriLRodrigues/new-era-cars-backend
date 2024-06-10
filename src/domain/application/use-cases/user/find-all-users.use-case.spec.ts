import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllUsersUseCase } from './find-all-users.use-case';

describe('Find All Users - Use Case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: FindAllUsersUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new FindAllUsersUseCase(inMemoryUserRepository);
    for (let i = 0; i < 10; i++) {
      const user = UserEntity.create({
        avatar: 'Avatar 1',
        username: `user_${i}`,
        email: `emailtest${i}@example.com`,
        name: 'TestUser',
        password: 'password',
      });
      inMemoryUserRepository.register({ user });
    }
  });

  it('should return all users', async () => {
    const output = await sut.execute({ limit: 10, page: 1 });

    expect(output.isRight()).toBe(true);
    expect(output.value).toHaveLength(10);
    expect(output.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          avatar: 'Avatar 1',
          username: `user_1`,
          email: `emailtest1@example.com`,
          name: 'TestUser',
          password: 'password',
        }),
      ]),
    );
  });
});
