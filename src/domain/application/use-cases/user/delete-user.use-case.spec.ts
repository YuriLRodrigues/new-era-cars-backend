import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteUserUseCase } from './delete-user.use-case';

describe('Delete User - Use Case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: DeleteUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(inMemoryUserRepository);
  });

  it('should be able to delete any user if you have the manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should not be able to delete any user if you not have the manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: sellerUser.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Invalid permission to delete an user'));
    expect(inMemoryUserRepository.users).toHaveLength(2);
  });

  it('should not be able to delete any user if id is invalid (non-existent)', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
    expect(inMemoryUserRepository.users).toHaveLength(2);
  });
});
