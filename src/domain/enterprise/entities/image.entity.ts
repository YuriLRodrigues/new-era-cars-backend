import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type ImageEntityProps = {
  url: string;
  advertisementImageId?: UniqueEntityId;
  advertisementThumbnailId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

type EditImageInfoProps = {
  url?: string;
  advertisementImageId?: UniqueEntityId;
  advertisementThumbnailId?: UniqueEntityId;
  updatedAt?: Date;
};

export class ImageEntity extends Entity<ImageEntityProps> {
  get url() {
    return this.props.url;
  }

  get advertisementImageId() {
    return this.props.advertisementImageId;
  }

  get advertisementThumbnailId() {
    return this.props.advertisementThumbnailId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set url(value: string) {
    this.props.url = value;
  }

  set setAdvertisementImageId(value: UniqueEntityId) {
    this.props.advertisementImageId = value;
  }

  set setAdvertisementThumbnailId(value: UniqueEntityId) {
    this.props.advertisementThumbnailId = value;
  }

  static create(props: Optional<ImageEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    const image = new ImageEntity(
      {
        advertisementImageId: props.advertisementImageId,
        advertisementThumbnailId: props.advertisementThumbnailId,
        url: props.url,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return image;
  }

  public editInfo(props: EditImageInfoProps): ImageEntity {
    this.props.url = props.url ?? this.props.url;
    this.props.advertisementImageId = props.advertisementImageId ?? this.props.advertisementImageId;
    this.props.advertisementThumbnailId = props.advertisementThumbnailId ?? this.props.advertisementThumbnailId;
    this.props.updatedAt = props.updatedAt ?? new Date();

    return this;
  }
}
