import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

export type FindByUsernameProps = {
  username: string;
};
export type FindByIdProps = {
  id: UniqueEntityId;
};

export type FindByEmailProps = {
  email: string;
};

export type RegisterProps = {
  user: UserEntity;
};

export type SaveProps = {
  user: UserEntity;
};

export type DeleteProps = {
  userId: UniqueEntityId;
};

export type FindAllUsersProps = {
  page: number;
  limit?: number;
};

export type meProps = {
  userId: UniqueEntityId;
};

export type FindAllTopSellersProps = {
  page: number;
  limit?: number;
};

export abstract class UserRepository {
  abstract me({ userId }: meProps): AsyncMaybe<UserEntity>;
  abstract findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity | null>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null>;
  abstract findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null>;
  abstract findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<PaginatedResult<UserEntity[]>>;
  abstract findAllTopSellers({ limit, page }: FindAllTopSellersProps): AsyncMaybe<PaginatedResult<TopSellerDetails[]>>;
  abstract register({ user }: RegisterProps): AsyncMaybe<UserEntity>;
  abstract save({ user }: SaveProps): AsyncMaybe<UserEntity>;
  abstract delete({ userId }: DeleteProps): AsyncMaybe<void>;
}
