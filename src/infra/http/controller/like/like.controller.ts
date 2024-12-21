import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { CreateLikeAdvertisementUseCase } from '@root/domain/application/use-cases/like/handle-advertisement-like.use-case';
import { CreateLikeFeedbackUseCase } from '@root/domain/application/use-cases/like/handle-feedback-like.use-case';
import { FindAdvertisementIsLikedUseCase } from '@root/domain/application/use-cases/like/find-advertisement-is-liked.use-case';
import { FindAllAdvertisementLikesUseCase } from '@root/domain/application/use-cases/like/find-all-advertisement-likes.use-case';
import { FindAllFeedbackLikesUseCase } from '@root/domain/application/use-cases/like/find-all-feedback-likes.use-case';
import { FindFeedbackIsLikedUseCase } from '@root/domain/application/use-cases/like/find-feedback-is-liked.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { CreateLikeAdSwaggerDoc } from './swagger-responses-dtos/create-like-ad/create-like-ad-swagger';
import { CreateLikeFbSwaggerDoc } from './swagger-responses-dtos/create-like-fb/create-like-fb-swagger';
import { FindAllAdIsLikedSwaggerDoc } from './swagger-responses-dtos/find-all-ad-is-liked/find-all-ad-is-liked-swagger';
import { FindAllAdLikesSwaggerDoc } from './swagger-responses-dtos/find-all-ad-likes/find-all-ad-likes-swagger';
import { FindAllFbIsLikedSwaggerDoc } from './swagger-responses-dtos/find-all-fb-is-liked/find-all-fb-is-liked-swagger';
import { FindAllFbLikesSwaggerDoc } from './swagger-responses-dtos/find-all-fb-likes/find-all-fb-likes-swagger';

@ApiTags('Like - Controller')
@Controller('/like')
export class LikeController {
  constructor(
    private readonly createLikeAdvertisement: CreateLikeAdvertisementUseCase,
    private readonly findAllAdvertisementLikes: FindAllAdvertisementLikesUseCase,
    private readonly findAdvertisementIsLiked: FindAdvertisementIsLikedUseCase,
    private readonly createLikeFeedback: CreateLikeFeedbackUseCase,
    private readonly findAllFeedbackLikes: FindAllFeedbackLikesUseCase,
    private readonly findFeedbackIsLiked: FindFeedbackIsLikedUseCase,
  ) {}

  @CreateLikeAdSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Post('ad/:id')
  async createLikeAd(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const likeAd = await this.createLikeAdvertisement.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (likeAd.isLeft()) {
      const error = likeAd.value;

      switch (error.message) {
        case 'Advertisement not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 201,
      message: 'Like created successfully in advertisement',
    };
  }

  @FindAllAdLikesSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Get('ad/:id')
  async findAllAdLikes(@Param('id') id: string) {
    const likesByAd = await this.findAllAdvertisementLikes.execute({
      advertisementId: new UniqueEntityId(id),
    });

    if (likesByAd.isLeft()) {
      const error = likesByAd.value;

      switch (error.message) {
        case 'Advertisement not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'Like count by advertisement was found successfully',
      results: likesByAd.value,
    };
  }

  @FindAllAdIsLikedSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Get('ad/is-liked/:id')
  async findAdIsLiked(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const isLiked = await this.findAdvertisementIsLiked.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    return {
      statusCode: 200,
      message: 'Validation if the user has already liked found',
      results: isLiked.value,
    };
  }

  @CreateLikeFbSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Post('fb/:id')
  async createLikeFB(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const likeFb = await this.createLikeFeedback.execute({
      feedbackId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (likeFb.isLeft()) {
      const error = likeFb.value;

      switch (error.message) {
        case 'Feedback not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 201,
      message: 'Like created successfully in feedback',
    };
  }

  @FindAllFbLikesSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Get('fb/:id')
  async findAllFbLikes(@Param('id') id: string) {
    const likesByFb = await this.findAllFeedbackLikes.execute({
      feedbackId: new UniqueEntityId(id),
    });

    if (likesByFb.isLeft()) {
      const error = likesByFb.value;

      switch (error.message) {
        case 'Feedback not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'Like count by feedback was found successfully',
      results: likesByFb.value,
    };
  }

  @FindAllFbIsLikedSwaggerDoc()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Manager], isAll: false })
  @Get('fb/is-liked/:id')
  async findFbIsLiked(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const isLiked = await this.findFeedbackIsLiked.execute({
      feedbackId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    return {
      statusCode: 200,
      message: 'Validation if the user has already liked found',
      results: isLiked.value,
    };
  }
}
