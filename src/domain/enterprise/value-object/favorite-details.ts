import { SoldStatus } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { Capacity, Doors, Fuel, GearBox } from '../entities/advertisement.entity';

type FavoriteDetailsProps = {
  id: UniqueEntityId;
  advertisement: {
    id: UniqueEntityId;
    title: string;
    thumbnailUrl: string;
    price: number;
    km: number;
    doors: Doors;
    gearBox: GearBox;
    fuel: Fuel;
    capacity: Capacity;
    soldStatus: SoldStatus;
  };
};

export class FavoriteDetails extends ValueObject<FavoriteDetailsProps> {
  get advertisement() {
    return this.props.advertisement;
  }

  get id() {
    return this.props.id;
  }

  static create(props: FavoriteDetailsProps) {
    return new FavoriteDetails({
      id: props.id,
      advertisement: {
        id: props.advertisement.id,
        price: props.advertisement.price,
        thumbnailUrl: props.advertisement.thumbnailUrl,
        title: props.advertisement.title,
        doors: props.advertisement.doors,
        capacity: props.advertisement.capacity,
        fuel: props.advertisement.fuel,
        gearBox: props.advertisement.gearBox,
        km: props.advertisement.km,
        soldStatus: props.advertisement.soldStatus,
      },
    });
  }
}
