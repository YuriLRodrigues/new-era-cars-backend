import { Module } from '@nestjs/common';
import { AdvertisementImageRepository } from '@root/domain/application/repositories/advertisement-image.repository';
import { AdvertisementThumbnailRepository } from '@root/domain/application/repositories/advertisement-thumbnail.repository';
import { AdvertisementRepository } from '@root/domain/application/repositories/advertisement.repository';
import { BrandRepository } from '@root/domain/application/repositories/brand.repository';
import { FeedbackRepository } from '@root/domain/application/repositories/feedback.repository';
import { ImageRepository } from '@root/domain/application/repositories/image.repository';
import { LikeAdvertisementRepository } from '@root/domain/application/repositories/like-advertisement.reposiotry';
import { LikeFeedbackRepository } from '@root/domain/application/repositories/like-feedback.reposiotry';
import { UserRepository } from '@root/domain/application/repositories/user.repository';

import { PrismaService } from './prisma.service';
import { PrismaAdvertisementImageRepository } from './repositories/prisma-advertisement-image.repository';
import { PrismaAdvertisementThumbnailRepository } from './repositories/prisma-advertisement-thumbnail.repository';
import { PrismaAdvertisementRepository } from './repositories/prisma-advertisement.repository';
import { PrismaBrandRepository } from './repositories/prisma-brand.repository';
import { PrismaFeedbackRepository } from './repositories/prisma-feedback.repository';
import { PrismaImageRepository } from './repositories/prisma-image.repository';
import { PrismaLikeAdvertisementRepository } from './repositories/prisma-like-advertisement.repository';
import { PrismaLikeFeedbackRepository } from './repositories/prisma-like-feedback.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: AdvertisementRepository,
      useClass: PrismaAdvertisementRepository,
    },
    {
      provide: ImageRepository,
      useClass: PrismaImageRepository,
    },
    {
      provide: AdvertisementImageRepository,
      useClass: PrismaAdvertisementImageRepository,
    },
    {
      provide: BrandRepository,
      useClass: PrismaBrandRepository,
    },
    {
      provide: AdvertisementThumbnailRepository,
      useClass: PrismaAdvertisementThumbnailRepository,
    },
    {
      provide: FeedbackRepository,
      useClass: PrismaFeedbackRepository,
    },
    {
      provide: LikeAdvertisementRepository,
      useClass: PrismaLikeAdvertisementRepository,
    },
    {
      provide: LikeFeedbackRepository,
      useClass: PrismaLikeFeedbackRepository,
    },
    {
      provide: BrandRepository,
      useClass: PrismaBrandRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    BrandRepository,
    AdvertisementImageRepository,
    ImageRepository,
    AdvertisementRepository,
    AdvertisementThumbnailRepository,
    FeedbackRepository,
    LikeFeedbackRepository,
    LikeAdvertisementRepository,
    BrandRepository,
  ],
})
export class DatabaseModule {}
