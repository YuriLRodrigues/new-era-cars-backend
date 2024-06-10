import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  page: number;
  limit: number;
  userId: UniqueEntityId;
};

type Output = Either<Error, ImageEntity[]>;

export class FindAllImagesUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ limit, page, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new Error('You do not have permission to find all images'));
    }

    const { value: images } = await this.imageRepository.findAll({ limit, page });

    return right(images);
  }
}
