import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

export type TopSellerDetailsProps = {
  id: UniqueEntityId;
  profileImg: string;
  name: string;
  amountSold: number;
  quantitySold: number;
};

export class TopSellerDetails extends ValueObject<TopSellerDetailsProps> {
  get id() {
    return this.props.id;
  }

  get profileImg() {
    return this.props.profileImg;
  }

  get name() {
    return this.props.name;
  }

  get amountSold() {
    return this.props.amountSold;
  }

  get quantitySold() {
    return this.props.quantitySold;
  }

  public static create(props: TopSellerDetailsProps) {
    return new TopSellerDetails(props);
  }
}
