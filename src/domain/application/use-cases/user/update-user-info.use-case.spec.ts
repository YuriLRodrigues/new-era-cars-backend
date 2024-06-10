import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateUserInfoUseCase } from './update-user-info.use-case';

describe('Update User Info - Use Case', () => {
  let sut: UpdateUserInfoUseCase;
  let inMemoryUserRepository: InMemoryUserRepository;

  const user = makeFakeUser();

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new UpdateUserInfoUseCase(inMemoryUserRepository);
    inMemoryUserRepository.register({ user });
  });

  it('should be able to update a user with your correctly id', async () => {
    const output = await sut.execute({
      id: user.id,
      avatar: 'new avatar',
      name: 'New Name',
      username: 'new_username',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(UserEntity);
    expect(output.value).toEqual(
      expect.objectContaining({
        avatar: 'new avatar',
        name: 'New Name',
        username: 'new_username',
      }),
    );
  });

  it('should not be able to update a user with invalid id', async () => {
    const output = await sut.execute({
      id: new UniqueEntityId(),
      avatar: 'new avatar',
      name: 'New Name',
      username: 'new_username',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).not.toBeInstanceOf(UserEntity);
    expect(output.value).toEqual(new Error('User not found'));
  });
});
