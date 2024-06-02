import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateAdUseCase } from './update-ad.use-case';

describe('Update Advertisement - Use Case', () => {
  let sut: UpdateAdUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    sut = new UpdateAdUseCase(inMemoryAdRepository, inMemoryUserRepository);
  });

  it('should be able to edit an advertisement with any param of adEntity except thumbnailId', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ userId: user.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: advertisement.id,
      title: 'New Title - Test',
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryAdRepository.advertisements[0]).toEqual(
      expect.objectContaining({
        title: 'New Title - Test',
      }),
    );
  });

  it('should not be able to edit an advertisement with invalidId', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title', userId: user.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: new UniqueEntityId(),
      title: 'New Title - Test',
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Ad not found'));
  });

  it('should not be able to edit an advertisement with invalid userId (non-existent)', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title' });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: advertisement.id,
      title: 'New Title - Test',
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });

  it('should not possible to update an ad if you are not the manager or owner of the ad', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title' });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: advertisement.id,
      title: 'New Title - Test',
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to update this ad'));
  });
});
