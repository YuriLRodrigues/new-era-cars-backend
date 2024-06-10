import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteOwnUserUseCase } from './delete-own-user.use-case';

describe('Delete Own User - Use Case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: DeleteOwnUserUseCase;
  let user: UserEntity;
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteOwnUserUseCase(inMemoryUserRepository);

    user = UserEntity.create({
      avatar: 'Avatar 1',
      username: 'testUser',
      email: 'emailtest@example.com',
      name: 'TestUser',
      password: 'password',
    });
    inMemoryUserRepository.register({ user });
  });

  it('should be able to delete own user with correctly id', async () => {
    const output = await sut.execute({ id: user.id });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to delete own user with correctly id', async () => {
    const output = await sut.execute({ id: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });
});
