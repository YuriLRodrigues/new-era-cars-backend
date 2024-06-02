import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';

import { FindAdByIdUseCase } from './find-ad-by-id.use-case';

describe('Find Advertisement - Use Case', () => {
  let sut: FindAdByIdUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;

  beforeEach(() => {
    inMemoryAdRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    sut = new FindAdByIdUseCase(inMemoryAdRepository);
  });

  it('should be able to find an advertisement by id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({ id: advertisement.id });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(expect.objectContaining(advertisement));
    expect(inMemoryAdRepository.advertisements).toHaveLength(1);
  });

  it('should not be able to find an advertisement by invalid id (non-existent)', async () => {
    const output = await sut.execute({ id: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Advertisement not found'));
  });
});
