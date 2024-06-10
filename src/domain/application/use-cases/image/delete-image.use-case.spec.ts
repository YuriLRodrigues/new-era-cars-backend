import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteImageUseCase } from './delete-image.use-case';

describe('Delete Image - Use Case', () => {
  let sut: DeleteImageUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteImageUseCase(inMemoryImageRepository, inMemoryUserRepository);
  });

  it('should be able to delete an image by id', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: image.id,
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryImageRepository.images).toHaveLength(0);
  });

  it('should not be able to delete an image if your user is not manager', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      id: image.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to delete this image'));
    expect(inMemoryImageRepository.images).toHaveLength(1);
  });

  it('should not be able to delete an image if your id is invalid (non-existent) ', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: new UniqueEntityId(),
      userId: adminUser.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Image not found'));
  });
});
