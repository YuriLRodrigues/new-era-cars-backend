import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateLikeAdvertisementUseCase } from './create-like-advertisement.use-case';

describe('Create Like Advertisement - Use Case', () => {
  let sut: CreateLikeAdvertisementUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    sut = new CreateLikeAdvertisementUseCase(inMemoryLikeAdvertisementRepository, inMemoryAdvertisementRepository);
  });

  it('should be able create a new like to a advertisement if already exists', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(LikeEntity);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(1);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes[0]).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        userId: user.id,
      }),
    );
  });

  it('should not be able create a new like to a advertisement if advertisementId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
    expect(output.value).toEqual(new Error('Advertisement not found'));
  });

  it('should be able to remove the like if user already liked advertisement', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });
    inMemoryLikeAdvertisementRepository.advertisementLikes.push(
      makeFakeLike({ userId: user.id, advertisementId: advertisement.id }),
    );

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });
    // kalil
    expect(output.isRight()).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
    expect(output.value).toEqual(null);
  });
});
