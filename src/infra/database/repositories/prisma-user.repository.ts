import { Injectable } from '@nestjs/common';
import { SoldStatus } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  DeleteProps,
  FindAllTopSellersProps,
  FindAllUsersProps,
  FindByEmailProps,
  FindByIdProps,
  FindByUsernameProps,
  meProps,
  RegisterProps,
  SaveProps,
  UserRepository,
} from '@root/domain/application/repositories/user.repository';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

import { UserMappers } from '../mappers/user.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async me({ userId }: meProps): AsyncMaybe<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<PaginatedResult<UserEntity[]>> {
    const [count, users] = await this.prismaService.$transaction([
      this.prismaService.user.count(),
      this.prismaService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const mappedUsers = users.map((user) => UserMappers.toDomain(user));

    return Maybe.some({
      data: mappedUsers,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

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

  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    const raw = UserMappers.toPersistence(user);

    const createdUser = await this.prismaService.user.create({
      data: raw,
    });

    const mappedUser = UserMappers.toDomain(createdUser);

    return Maybe.some(mappedUser);
  }

  async findAllTopSellers({}: FindAllTopSellersProps): AsyncMaybe<PaginatedResult<TopSellerDetails[]>> {
    const [sellers, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: { roles: { hasSome: [UserRoles.Seller] } },
        select: {
          id: true,
          avatar: true,
          name: true,
          advertisement: {
            where: { soldStatus: SoldStatus.Sold },
            select: {
              price: true,
            },
          },
          _count: {
            select: {
              advertisement: {
                where: { soldStatus: SoldStatus.Sold },
              },
            },
          },
        },
      }),
      this.prismaService.user.count({ where: { roles: { hasSome: [UserRoles.Seller] } } }),
    ]);

    const mappedTopSellers = sellers.map((seller) => {
      const totalAmountSold = seller.advertisement.reduce((sum, ad) => sum + ad.price, 0);

      return TopSellerDetails.create({
        id: new UniqueEntityId(seller.id),
        profileImg: seller.avatar,
        name: seller.name,
        amountSold: totalAmountSold,
        quantitySold: seller._count.advertisement,
      });
    });

    return Maybe.some({
      data: mappedTopSellers,
      meta: {
        page: 1,
        perPage: mappedTopSellers.length,
        totalPages: Math.ceil(count / mappedTopSellers.length),
        totalCount: count,
      },
    });
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
