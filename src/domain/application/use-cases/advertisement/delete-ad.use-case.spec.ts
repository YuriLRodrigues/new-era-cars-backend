import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteAdUseCase } from './delete-ad.use-case';

describe('Delete Advertisement - Use Case', () => {
  let sut: DeleteAdUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;

  beforeEach(() => {
    inMemoryAdRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteAdUseCase(inMemoryAdRepository, inMemoryUserRepository);
  });

  it('should be possible to delete an ad if you are the owner or manager', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement();
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      userId: user.id,
      advertisementId: advertisement.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryAdRepository.advertisements).toHaveLength(0);
  });

  it('should not be possible to delete an ad if you are not the owner or manager', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement();
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      userId: user.id,
      advertisementId: advertisement.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to delete this ad'));
  });

  it('should not be possible to delete an ad if user id is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      userId: new UniqueEntityId(),
      advertisementId: advertisement.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });

  it('should not be possible to delete an ad if advertisementId is invalid (non-existent)', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      advertisementId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Advertisement not found'));
  });
});
