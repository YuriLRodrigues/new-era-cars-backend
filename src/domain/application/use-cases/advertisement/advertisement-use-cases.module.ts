import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateAdUseCase } from './create-ad.use-case';
import { DeleteAdUseCase } from './delete-ad.use-case';
import { FindAdByIdUseCase } from './find-ad-by-id.use-case';
import { FindAllAdsByUserIdUseCase } from './find-all-ads-by-user-id.use-case';
import { FindAllAdsUseCase } from './find-all-ads.use-case';
import { FindAllSoldsAdsUseCase } from './find-all-sold-ads.use-case';
import { FindMetricsByUserIdUseCase } from './find-metrics-by-user-id.use-case';
import { FindMetricsUseCase } from './find-metrics.use-case';
import { UpdateAdUseCase } from './update-ad.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateAdUseCase,
    DeleteAdUseCase,
    FindAdByIdUseCase,
    FindAllAdsByUserIdUseCase,
    FindAllAdsUseCase,
    FindAllSoldsAdsUseCase,
    FindMetricsByUserIdUseCase,
    FindMetricsUseCase,
    UpdateAdUseCase,
  ],
  exports: [
    CreateAdUseCase,
    DeleteAdUseCase,
    FindAdByIdUseCase,
    FindAllAdsByUserIdUseCase,
    FindAllAdsUseCase,
    FindAllSoldsAdsUseCase,
    FindMetricsByUserIdUseCase,
    FindMetricsUseCase,
    UpdateAdUseCase,
  ],
})
export class AdvertisementUseCasesModule {}
