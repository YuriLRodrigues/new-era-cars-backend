import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<Error, void>;

export class DeleteImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new Error('You do not have permission to delete this image'));
    }

    const { isNone: imageNotExists, value: image } = await this.imageRepository.findById({ id });

    if (imageNotExists()) {
      return left(new Error('Image not found'));
    }

    await this.imageRepository.delete({ imageId: image.id });

    return right(null);
  }
}
