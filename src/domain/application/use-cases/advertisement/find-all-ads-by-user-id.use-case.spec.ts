import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { repeat } from '@root/utils/repeat';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllAdsByUserIdUseCase } from './find-all-ads-by-user-id.use-case';

describe('Find All Advertisements By UserId - Use Case', () => {
  let sut: FindAllAdsByUserIdUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    sut = new FindAllAdsByUserIdUseCase(inMemoryAdRepository, inMemoryUserRepository);
  });

  it('should be able to find all advertisements by user id ', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    repeat(5, () => {
      const advertisement = makeFakeAdvertisement();
      inMemoryAdRepository.createAd({ advertisement });
    });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      userId: user.id,
      limit: 2,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryAdRepository.advertisements).toHaveLength(6);
    expect(output.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          brand: { brandId: brand.id, name: brand.name, imageUrl: brand.logoUrl },
        }),
      ]),
    );
    expect(output.value).toHaveLength(1);
  });

  it('should not be able to find all advertisements by user id if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityId(),
      limit: 2,
      page: 1,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });

  it('should be able to return an lenght 0 if items not exist', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toHaveLength(0);
  });
});
