import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { BrandRepository } from '../../repositories/brand.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  logoUrl: string;
  name: string;
  userId: UniqueEntityId;
};

type Output = Either<ResourceAlreadyExistsError | ResourceNotFoundError | NotAllowedError, BrandEntity>;

export class CreateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ logoUrl, name, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    if (!user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { isSome: brandAlreadyExists } = await this.brandRepository.findByName({ name });

    if (brandAlreadyExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const brand = BrandEntity.create({
      logoUrl,
      name,
    });

    const { value: createdBrand } = await this.brandRepository.create({ brand });

    return right(createdBrand);
  }
}
