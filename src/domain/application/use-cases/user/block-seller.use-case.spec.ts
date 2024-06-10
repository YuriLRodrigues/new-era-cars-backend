import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { BlockSellerUseCase } from './block-seller.use-case';

describe('Block Seller - Use Case', () => {
  let sut: BlockSellerUseCase;
  let inMemoryUserUseCase: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserUseCase = new InMemoryUserRepository();
    sut = new BlockSellerUseCase(inMemoryUserUseCase);
  });

  it('should be able to block an seller if you have Manager permission', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserUseCase.register({ user: adminUser });
    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserUseCase.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      sellerId: sellerUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to block an seller if you not have Manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserUseCase.register({ user });
    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserUseCase.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: user.id,
      sellerId: sellerUser.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Invalid permission to block an seller'));
  });

  it('should not be able to find an user with invalid id (non-existent)', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserUseCase.register({ user: adminUser });
    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserUseCase.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      sellerId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });
});
