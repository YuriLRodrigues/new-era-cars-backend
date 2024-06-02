import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

export type UserViewModelProps = {
  id: string;
  avatar: string;
  email: string;
  name: string;
  username: string;
  roles: UserRoles[];
  createdAt: Date;
  updatedAt: Date;
};

export class UserViewModel {
  static toHttp(user: UserEntity): UserViewModelProps {
    return {
      id: user.id.toValue(),
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
