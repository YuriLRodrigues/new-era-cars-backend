import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAdvertisementIsLikedUseCase } from './find-advertisement-is-liked.use-case';

describe('Find Advertisement Is Liked - Use Case', () => {
  let sut: FindAdvertisementIsLikedUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    sut = new FindAdvertisementIsLikedUseCase(inMemoryLikeAdvertisementRepository);
  });

  it('should validate that the user has already liked the ad and value should return true', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const like = makeFakeLike({ advertisementId: advertisement.id, userId: user.id });
    inMemoryLikeAdvertisementRepository.create({ like });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(1);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes[0]).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        userId: user.id,
      }),
    );
  });

  it('should validate that the user has not liked the ad and value should return false', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBe(false);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
  });
});
