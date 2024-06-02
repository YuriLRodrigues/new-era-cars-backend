import { Injectable } from '@nestjs/common';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  DeleteProps,
  FindAllUsersProps,
  FindByEmailProps,
  FindByIdProps,
  FindByUsernameProps,
  RegisterProps,
  SaveProps,
  UserRepository,
} from '@root/domain/application/repositories/user.repository';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';

import { UserMappers } from '../mappers/user.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      skip: page,
      take: limit,
    });

    const mappedUsers = users.map((user) => UserMappers.toDomain(user));

    return Maybe.some(mappedUsers);
  }

  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    const raw = UserMappers.toPersistence(user);

    const createdUser = await this.prismaService.user.create({
      data: raw,
    });

    const mappedUser = UserMappers.toDomain(createdUser);

    return Maybe.some(mappedUser);
  }

  async save({ user }: SaveProps): AsyncMaybe<UserEntity> {
    const raw = UserMappers.toPersistence(user);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    const mappedUser = UserMappers.toDomain(updatedUser);

    return Maybe.some(mappedUser);
  }

  async delete({ userId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.user.delete({
      where: {
        id: userId.toValue(),
      },
    });

    return;
  }
}
