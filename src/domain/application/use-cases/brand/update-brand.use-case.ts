import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { BrandRepository } from '../../repositories/brand.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
  logoUrl?: string;
  name?: string;
};

type Output = Either<NotAllowedError | ResourceNotFoundError, void>;

export class UpdateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, name, logoUrl, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { isNone: brandNotExists, value: brand } = await this.brandRepository.findById({ id });

    if (brandNotExists()) {
      return left(new ResourceNotFoundError());
    }

    brand.editInfo({
      logoUrl,
      name,
    });

    await this.brandRepository.save({ brand });

    return right(null);
  }
}
