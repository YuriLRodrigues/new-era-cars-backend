import { Injectable } from '@nestjs/common';
import { Either, right } from '@root/core/logic/Either';
import { QueryDataDTO } from '@root/infra/controller/advertisemet/dto/query-data.dto';

import { AdvertisementRepository, FindAllAdvertisementsProps } from '../../repositories/advertisement.repository';

type Output = Either<Error, FindAllAdvertisementsProps>;

type Input = {
  page: number;
  limit: number;
  search?: QueryDataDTO;
};

@Injectable()
export class FindAllAdsUseCase {
  constructor(private readonly advertisementRepository: AdvertisementRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const { value: advertisements } = await this.advertisementRepository.findAllAds({
      limit,
      page,
    });

    return right(advertisements);
  }
}
