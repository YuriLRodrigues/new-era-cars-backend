import { repeat } from '@root/utils/repeat';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';

import { FindAllAdsUseCase } from './find-all-ads.use-case';

describe('Find All Advertisements - Use Case', () => {
  let sut: FindAllAdsUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    sut = new FindAllAdsUseCase(inMemoryAdRepository);
  });

  it('should be able to find all advertisements', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    repeat(5, () => {
      const advertisement = makeFakeAdvertisement({ brandId: brand.id });
      inMemoryAdRepository.createAd({ advertisement });
    });

    const advertisement = makeFakeAdvertisement({ brandId: brand.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryAdRepository.advertisements).toHaveLength(6);
    expect(output.value).toHaveLength(6);
  });

  it('should be able to return an lenght 0 if items not exist', async () => {
    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toHaveLength(0);
  });
});
