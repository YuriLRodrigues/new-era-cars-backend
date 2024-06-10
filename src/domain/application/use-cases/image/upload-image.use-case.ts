import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { ImageRepository } from '../../repositories/image.repository';
import { Uploader } from '../../repositories/uploader.repository';
import { UserRepository } from '../../repositories/user.repository';

type ImageProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

type Input = {
  image: ImageProps;
  userId: UniqueEntityId;
  advertisementImageId?: UniqueEntityId;
  advertisementThumbnailId?: UniqueEntityId;
};

type Output = Either<Error, ImageEntity>;

export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ image, userId, advertisementImageId, advertisementThumbnailId }: Input): Promise<Output> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(image.fileType)) {
      return left(new Error(`Invalid image type`));
    }

    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || user.roles.includes(UserRoles.Customer)) {
      return left(new Error('You do not have permission to upload an image'));
    }

    const imageUploaded = await this.uploader.uploadImage({ image });

    const imageEntity = ImageEntity.create({
      url: imageUploaded.url,
      advertisementImageId,
      advertisementThumbnailId,
    });

    await this.imageRepository.create({ image: imageEntity });

    return right(imageEntity);
  }
}
