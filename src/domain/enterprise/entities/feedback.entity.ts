import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

export type FeedbackEntityProps = {
  stars: number;
  comment: string;
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

type EditFeedbackEntityProps = {
  stars?: number;
  comment?: string;
};

export class FeedbackEntity extends Entity<FeedbackEntityProps> {
  get userId() {
    return this.props.userId;
  }

  get advertisementId() {
    return this.props.advertisementId;
  }

  get comment() {
    return this.props.comment;
  }

  get stars() {
    return this.props.stars;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(data: Optional<FeedbackEntityProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
    return new FeedbackEntity(
      {
        userId: data.userId,
        advertisementId: data.advertisementId,
        stars: data.stars,
        comment: data.comment,
        createdAt: data.createdAt ?? new Date(),
        updatedAt: data.updatedAt ?? new Date(),
      },
      id,
    );
  }

  public editInfo(data: EditFeedbackEntityProps) {
    this.props.stars = data.stars ?? this.props.stars;
    this.props.comment = data.comment ?? this.props.comment;

    return this;
  }
}
