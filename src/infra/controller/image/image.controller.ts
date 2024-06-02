import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { DeleteImageUseCase } from '@root/domain/application/use-cases/image/delete-image.use-case';
import { FindAllImagesUseCase } from '@root/domain/application/use-cases/image/find-all-images.use-case';
import { UploadImageUseCase } from '@root/domain/application/use-cases/image/upload-image.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/http/auth/auth-user';
import { CurrentUser } from '@root/infra/http/auth/current-user';
import { Roles } from '@root/infra/http/auth/roles';

import { FileUploadDTO } from './dto/upload.dto';
import { DeleteSwaggerDoc } from './swagger-responses-dtos/delete/delete-swagger';
import { FindAllSwaggerDoc } from './swagger-responses-dtos/find-all/find-all-swagger';
import { UploadSwaggerDoc } from './swagger-responses-dtos/upload/upload-swagger';

@ApiTags('Image - Controller')
@Controller('image')
export class ImageController {
  constructor(
    private readonly uploadImage: UploadImageUseCase,
    private readonly findAllImages: FindAllImagesUseCase,
    private readonly deleteImage: DeleteImageUseCase,
  ) {}

  @UploadSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() { file }: FileUploadDTO, @CurrentUser() { sub }: UserPayload) {
    const image = await this.uploadImage.execute({ image: file, userId: new UniqueEntityId(sub) });

    if (image.isLeft()) {
      const error = image.value;

      switch (error.message) {
        case 'Invalid image type':
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
        case 'You do not have permission to upload an image':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
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
      message: 'Image uploaded successfully',
      response: {
        id: image.value.id,
        url: image.value.url,
      },
    };
  }

  @FindAllSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('all')
  async findAll(@Query('page') page: string, @CurrentUser() { sub }: UserPayload) {
    const images = await this.findAllImages.execute({
      limit: 30,
      page: Number(page) - 1,
      userId: new UniqueEntityId(sub),
    });

    if (images.isLeft()) {
      const error = images.value;

      switch (error.message) {
        case 'You do not have permission to find all images':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
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
      message: 'Images found',
      response: images.value,
    };
  }

  @DeleteSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Customer] })
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const image = await this.deleteImage.execute({ id: new UniqueEntityId(id), userId: new UniqueEntityId(sub) });

    if (image.isLeft()) {
      const error = image.value;

      switch (error.message) {
        case 'You do not have permission to delete this image':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case 'Image not found':
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
      message: 'Image deleted successfully',
    };
  }
}
