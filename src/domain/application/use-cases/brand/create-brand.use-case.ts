import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
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

type Output = Either<Error, BrandEntity>;

export class CreateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ logoUrl, name, userId }: Input): Promise<Output> {
    const { isSome: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists()) {
      return left(new Error('Brand already exists'));
    }

    if (!user.roles.includes(UserRoles.Manager)) {
      return left(new Error('You are not allowed to create a brand'));
    }

    const { isSome: brandAlreadyExists } = await this.brandRepository.findByName({ name });

    if (brandAlreadyExists()) {
      return left(new Error('Brand already exists'));
    }

    const brand = BrandEntity.create({
      logoUrl,
      name,
    });

    const { value: createdBrand } = await this.brandRepository.create({ brand });

    return right(createdBrand);
  }
}
