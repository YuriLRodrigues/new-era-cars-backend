import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateBrandUseCase } from './create-brand.use-case';

describe('Create Brand - Use Case', () => {
  let sut: CreateBrandUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdRepository);
    inMemoryLikeRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
    );
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
    expect(output.value).toBeInstanceOf(ResourceAlreadyExistsError);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if user is not admin', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user: user });

    await sut.execute({
      logoUrl: 'url-test',
      name: 'Test',
      userId: user.id,
    });

    const output = await sut.execute({
      userId: user.id,
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });

  it('should not be able to create an new brand if user not exists', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityId(),
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });
});
