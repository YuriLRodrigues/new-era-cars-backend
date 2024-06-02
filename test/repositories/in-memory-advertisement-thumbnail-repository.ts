import {
  AdvertisementThumbnailRepository,
  UpdateProps,
} from '@root/domain/application/repositories/advertisement-thumbnail.repository';
import { AdvertisementThumbnail } from '@root/domain/enterprise/value-object/advertisement-thumbnail';

export class InMemoryAdvertisementThumbnailRepository implements AdvertisementThumbnailRepository {
  public advertisementThumbnail: AdvertisementThumbnail[] = [];

  async update({ advertisementThumbnail }: UpdateProps): Promise<void> {
    this.advertisementThumbnail = this.advertisementThumbnail.map((adThumb) => {
      if (adThumb.advertisementId.equals(advertisementThumbnail.advertisementId)) {
        return advertisementThumbnail;
      }

      return adThumb;
    });

    return;
  }
}
