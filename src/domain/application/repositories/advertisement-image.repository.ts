import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

export type CreateManyProps = {
  advertisementImages: AdvertisementImage[];
};

export abstract class AdvertisementImageRepository {
  abstract createMany({ advertisementImages }: CreateManyProps): Promise<void>;
}
