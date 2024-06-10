import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllAdvertisementLikesUseCase } from './find-all-advertisement-likes.use-case';

describe('Find All Advertisement Likes - Use Case', () => {
  let sut: FindAllAdvertisementLikesUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    sut = new FindAllAdvertisementLikesUseCase(inMemoryLikeAdvertisementRepository, inMemoryAdvertisementRepository);
  });

  it('should be able to find all likes of a advertisement by your id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike({ advertisementId: advertisement.id });
      inMemoryLikeAdvertisementRepository.create({ like });
    });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike();
      inMemoryLikeAdvertisementRepository.create({ like });
    });

    const output = await sut.execute({
      advertisementId: advertisement.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(5);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(10);
  });

  it('should not be able to find all likes of a feedback if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Advertisement not found'));
  });
});
