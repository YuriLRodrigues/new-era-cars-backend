import { Module } from '@nestjs/common';
import { AdvertisementUseCasesModule } from '@root/domain/application/use-cases/advertisement/advertisement-use-cases.module';
import { ImageUseCasesModule } from '@root/domain/application/use-cases/image/image-use-cases.module';
import { LikeUseCaseModule } from '@root/domain/application/use-cases/like/like-use-cases.module';
import { UserUseCasesModule } from '@root/domain/application/use-cases/user/user-use-cases.module';

import { AdvertisementController } from '../controller/advertisemet/advertisement.controller';
import { ImageController } from '../controller/image/image.controller';
import { LikeController } from '../controller/like/like.controller';
import { UserController } from '../controller/user/user.controller';

@Module({
  imports: [UserUseCasesModule, AdvertisementUseCasesModule, ImageUseCasesModule, LikeUseCaseModule],
  controllers: [UserController, AdvertisementController, ImageController, LikeController],
})
export class HttpModule {}
