import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUploaderRepository } from 'test/repositories/in-memory-uploader-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateImageUseCase } from './update-image.use-case';

describe('Update Image - Use Case', () => {
  let sut: UpdateImageUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUploaderRepository: InMemoryUploaderRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryUploaderRepository = new InMemoryUploaderRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new UpdateImageUseCase(inMemoryImageRepository, inMemoryUploaderRepository, inMemoryUserRepository);
  });

  it('should be able to update an image by your correctly id', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: image.id,
      userId: adminUser.id,
      newImage: {
        body: Buffer.from(''),
        fileName: 'image-test',
        fileSize: 100,
        fileType: 'image/png',
      },
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
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
    expect(output.value).toEqual(new Error('You do not have permission to update this image'));
  });
});
