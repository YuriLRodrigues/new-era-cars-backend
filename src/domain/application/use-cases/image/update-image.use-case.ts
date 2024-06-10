import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
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
  id: UniqueEntityId;
  userId: UniqueEntityId;
  newImage?: ImageProps;
  advertisementImageId?: UniqueEntityId;
  advertisementThumbnailId?: UniqueEntityId;
};

type Output = Either<Error, void>;

export class UpdateImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, userId, newImage, advertisementImageId, advertisementThumbnailId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new Error('You do not have permission to update this image'));
    }

    const { isNone: imageNotExists, value: image } = await this.imageRepository.findById({ id });

    if (imageNotExists()) {
      return left(new Error('Image not found'));
    }

    const newImageUploaded = await this.uploader.uploadImage({ image: newImage });

    image.editInfo({
      advertisementImageId,
      advertisementThumbnailId,
      url: newImageUploaded.url,
    });

    await this.imageRepository.save({ image });

    return right(null);
  }
}
