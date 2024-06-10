import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { repeat } from '@root/utils/repeat';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllImagesUseCase } from './find-all-images.use-case';

describe('Find All Images - Use Case', () => {
  let sut: FindAllImagesUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new FindAllImagesUseCase(inMemoryImageRepository, inMemoryUserRepository);
  });

  it('should be able to find all images', async () => {
    repeat(10, () => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });
    });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      limit: 2,
      page: 1,
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toHaveLength(2);
    expect(inMemoryImageRepository.images).toHaveLength(10);
  });

  it('should not be able to delete an image if your user is not manager', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      limit: 10,
      page: 1,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to find all images'));
  });
});
