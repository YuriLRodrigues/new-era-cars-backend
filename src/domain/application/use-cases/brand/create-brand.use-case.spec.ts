import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateBrandUseCase } from './create-brand.use-case';

describe('Create Brand - Use Case', () => {
  let sut: CreateBrandUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository);
  });

  it('should be able to create an new brand', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      userId: adminUser.id,
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if name already exists', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    await sut.execute({
      logoUrl: 'url-test',
      name: 'Test',
      userId: adminUser.id,
    });

    const output = await sut.execute({
      userId: adminUser.id,
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Brand already exists'));
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if user not exists', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityId(),
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });
});
