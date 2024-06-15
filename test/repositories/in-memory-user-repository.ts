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

export class InMemoryUserRepository implements UserRepository {
  findAllSellCount: any;
  public users: UserEntity[] = [];

  async findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.username === username);

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.id.equals(id));

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.email === email);

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<UserEntity[]> {
    return Maybe.some(this.users.slice((page - 1) * limit, limit * page));
  }

  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    this.users.push(user);

    return Maybe.some(user);
  }

  async save({ user }: SaveProps): AsyncMaybe<UserEntity> {
    const index = this.users.findIndex((u) => u.id === user.id);

    this.users[index] = user;

    return Maybe.some(this.users[index]);
  }

  async delete({ userId }: DeleteProps): AsyncMaybe<void> {
    this.users = this.users.filter((u) => u.id.toValue() !== userId.toValue());

    return Maybe.none();
  }
}
