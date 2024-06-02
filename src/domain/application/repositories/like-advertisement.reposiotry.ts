import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

export type CreateProps = {
  like: LikeEntity;
};

export type DeleteProps = {
  likeId: UniqueEntityId;
};

export type FindByIdProps = {
  advertisementId: UniqueEntityId;
};

export type FindAllProps = {
  advertisementId: UniqueEntityId;
};

export abstract class LikeAdvertisementRepository {
  abstract create({ like }: CreateProps): AsyncMaybe<LikeEntity>;
  abstract findById({ advertisementId }: FindByIdProps): AsyncMaybe<LikeEntity>;
  abstract findAll({ advertisementId }: FindAllProps): AsyncMaybe<LikeEntity[]>;
  abstract findAllLikes({ advertisementId }: FindAllProps): AsyncMaybe<number>;
  abstract delete({ likeId }: DeleteProps): AsyncMaybe<void>;
  // abstract save({ like }: SaveProps): AsyncMaybe<void>; // kalil n precisa aq pq eu nao tenho um update, e o meu delete acontece dentro do create
}
