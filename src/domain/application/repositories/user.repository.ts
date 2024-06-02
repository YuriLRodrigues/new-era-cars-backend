import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';

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
  page?: number;
  limit?: number;
};

export abstract class UserRepository {
  abstract findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity | null>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null>;
  abstract findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null>;
  abstract findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<UserEntity[]>;
  abstract register({ user }: RegisterProps): AsyncMaybe<UserEntity>;
  abstract save({ user }: SaveProps): AsyncMaybe<UserEntity>;
  abstract delete({ userId }: DeleteProps): AsyncMaybe<void>;
}
