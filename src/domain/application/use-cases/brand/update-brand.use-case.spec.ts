import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateBrandUseCase } from './update-brand.use-case';

describe('Update Brand - Use Case', () => {
  let sut: UpdateBrandUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    sut = new UpdateBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository);
  });

  it('should be possible to update an brand if it exists', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: brand.id,
      userId: adminUser.id,
      logoUrl: 'url-test',
      name: 'New Brand Name',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to update an brand if your id is invalid (non-existent) ', async () => {
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
  });

  it('should not be able to update an brand if your user is not manager', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      id: brand.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to update this brand'));
  });
});
