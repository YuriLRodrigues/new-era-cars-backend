import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUploaderRepository } from 'test/repositories/in-memory-uploader-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UploadImageUseCase } from './upload-image.use-case';

describe('Upload And Create Image - Use Case', () => {
  let sut: UploadImageUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUploaderRepository: InMemoryUploaderRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryUploaderRepository = new InMemoryUploaderRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new UploadImageUseCase(inMemoryImageRepository, inMemoryUploaderRepository, inMemoryUserRepository);
  });

  it('should be able to create and upload an image', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      userId: adminUser.id,
      image: {
        body: Buffer.from(''),
        fileName: 'test-image.png',
        fileType: 'image/png',
        fileSize: 100,
      },
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryImageRepository.images).toHaveLength(1);
  });

  it('should not be able to create and upload an image if your user is customer', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      image: {
        body: Buffer.from(''),
        fileName: 'test-image.png',
        fileType: 'image/png',
        fileSize: 100,
      },
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to upload an image'));
    expect(inMemoryImageRepository.images).toHaveLength(0);
  });

  it('should not be able to create an image with an invalid type', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      image: {
        body: Buffer.from(''),
        fileName: 'test-image.png',
        fileType: 'image/html',
        fileSize: 100,
      },
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error(`Invalid image type`));
  });
});
