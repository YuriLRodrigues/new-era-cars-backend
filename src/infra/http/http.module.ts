import { Module } from '@nestjs/common';
import { AdvertisementUseCasesModule } from '@root/domain/application/use-cases/advertisement/advertisement-use-cases.module';
import { UserUseCasesModule } from '@root/domain/application/use-cases/user/user-use-cases.module';

import { CreateAdvertisementController } from './controller/advertisemet/create-ad.controller';
import { DeleteAdvertisementController } from './controller/advertisemet/delete-ad.controller';
import { FindAdvertisementByIdController } from './controller/advertisemet/find-ad-by-id.controller';
import { FindAllAdvertisementsByUserIdController } from './controller/advertisemet/find-all-ads-by-user-id.controller';
import { FindAllAdvertisementsController } from './controller/advertisemet/find-all-ads.controller';
import { FindAdvertisementsMetricsByUserIdController } from './controller/advertisemet/find-all-advertisements-metrics-by-user-id.controller';
import { FindAdvertisementsMetricsController } from './controller/advertisemet/find-all-advertisements-metrics.controller';
import { FindAllSoldAdsController } from './controller/advertisemet/find-all-sold-ads.controller';
import { UpdateAdvertisementController } from './controller/advertisemet/update-ad.controller';
import { DeleteImageController } from './controller/image/delete-image.controller';
import { FindAllImagesController } from './controller/image/find-all-images.controller';
import { FindImagesMetricsController } from './controller/image/find-images-metrics.controller';
import { UploadImagesController } from './controller/image/upload-images.controller';
import { BlockSellerController } from './controller/user/block-user.controller';
import { DeleteOwnUserController } from './controller/user/delete-own-user.controller';
import { DeleteUserController } from './controller/user/delete-user.controller';
import { FindAllTopSellersController } from './controller/user/find-all-top-sellers.controller';
import { FindAllUsersController } from './controller/user/find-all-users.controller';
import { ForgotPasswordController } from './controller/user/forgot-password.controller';
import { NewPasswordController } from './controller/user/new-password.controller';
import { SignInController } from './controller/user/sign-in.controller';
import { SignUpController } from './controller/user/sign-up.controller';
import { UpdateOwnUserController } from './controller/user/update-own-user.controller';

@Module({
  imports: [AdvertisementUseCasesModule, UserUseCasesModule],
  controllers: [
    CreateAdvertisementController,
    DeleteAdvertisementController,
    FindAdvertisementByIdController,
    FindAllAdvertisementsByUserIdController,
    FindAdvertisementsMetricsByUserIdController,
    FindAdvertisementsMetricsController,
    FindAllAdvertisementsController,
    FindAllSoldAdsController,
    UpdateAdvertisementController,

    BlockSellerController,
    DeleteOwnUserController,
    DeleteUserController,
    FindAllTopSellersController,
    FindAllUsersController,
    ForgotPasswordController,
    NewPasswordController,
    SignInController,
    SignUpController,
    UpdateOwnUserController,

    DeleteImageController,
    FindAllImagesController,
    FindImagesMetricsController,
    UploadImagesController,
  ],
})
export class HttpModule {}
