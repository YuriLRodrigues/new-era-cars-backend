import {
  AdvertisementImageRepository,
  CreateManyProps,
} from '@root/domain/application/repositories/advertisement-image.repository';
import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

export class InMemoryAdvertisementImageRepository implements AdvertisementImageRepository {
  public advertisementImages: AdvertisementImage[] = [];

  async createMany({ advertisementImages }: CreateManyProps): Promise<void> {
    advertisementImages.map((adImg) => this.advertisementImages.push(adImg));

    return;
  }
}
