import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

type FavoriteDetailsProps = {
  id: UniqueEntityId;
  advertisement: {
    id: UniqueEntityId;
    title: string;
    thumbnailUrl: string;
    price: number;
    status: string;
  };
  user: {
    id: UniqueEntityId;
    name: string;
    avatar: string;
  };
  favorites: number;
  createdAt: Date;
};

export class FavoriteAdminDetails extends ValueObject<FavoriteDetailsProps> {
  static create(props: FavoriteDetailsProps) {
    return new FavoriteAdminDetails({
      id: props.id,
      advertisement: {
        id: props.advertisement.id,
        price: props.advertisement.price,
        thumbnailUrl: props.advertisement.thumbnailUrl,
        title: props.advertisement.title,
        status: props.advertisement.status,
      },
      user: {
        avatar: props.user.avatar,
        id: props.user.id,
        name: props.user.name,
      },
      favorites: props.favorites,
      createdAt: props.createdAt,
    });
  }
}
