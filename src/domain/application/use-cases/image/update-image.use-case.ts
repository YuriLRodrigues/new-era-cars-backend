import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { ImageTypeError } from '../../errors/image-type-error';
import { AdvertisementRepository } from '../../repositories/advertisement.repository';
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
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
  newImages?: ImageProps[];
  removedImagesIds?: UniqueEntityId[];
};

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

export class UpdateImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId, userId, newImages, removedImagesIds }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.some((role) => role === UserRoles.Manager || role === UserRoles.Seller)) {
      return left(new NotAllowedError());
    }

    const { isNone: advertisementNotExists, value: advertisement } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotExists()) return left(new ResourceNotFoundError());

    if (advertisement.userId !== user.id && !user.roles.includes(UserRoles.Manager)) return left(new NotAllowedError());

    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (const image of newImages) {
      if (!/^(image\/(png|jpg|jpeg|webp))$/.test(image.fileType)) {
        return left(new ImageTypeError(`Unsupported file type: ${image.fileType}`));
      }

      if (image.fileSize > maxFileSize) {
        return left(new ImageTypeError(`File size exceeds the maximum limit of 5MB: ${image.fileSize} bytes`));
      }

      const imageUploaded = await this.uploader.uploadImage({ image });

      const imageEntity = ImageEntity.create({
        url: imageUploaded.url,
      });

      await this.imageRepository.create({ image: imageEntity });

      return right(null);
    }

    await this.imageRepository.deleteMany({ imagesIds: removedImagesIds });

    return right(null);
  }
}
