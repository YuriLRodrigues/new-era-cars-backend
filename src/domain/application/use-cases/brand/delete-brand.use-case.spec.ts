import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteBrandUseCase } from './delete-brand.use-case';

describe('Delete Brand - Use Case', () => {
  let sut: DeleteBrandUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository);
  });

  it(' should be possible to delete a tag if you are manager and brand exists', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: brand.id,
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });

  it('should not be able to delete an brand if your id is invalid (non-existent)', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: new UniqueEntityId(),
      userId: adminUser.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Brand not found'));
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to delete an brand if your user is not manager', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      id: brand.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to delete this brand'));
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });
});
