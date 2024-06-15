import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { CreateAdUseCase } from '@root/domain/application/use-cases/advertisement/create-ad.use-case';
import { DeleteAdUseCase } from '@root/domain/application/use-cases/advertisement/delete-ad.use-case';
import { FindAdByIdUseCase } from '@root/domain/application/use-cases/advertisement/find-ad-by-id.use-case';
import { FindAllAdsByUserIdUseCase } from '@root/domain/application/use-cases/advertisement/find-all-ads-by-user-id.use-case';
import { FindAllAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-ads.use-case';
import { UpdateAdUseCase } from '@root/domain/application/use-cases/advertisement/update-ad.use-case';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/http/auth/auth-user';
import { CurrentUser } from '@root/infra/http/auth/current-user';
import { Public } from '@root/infra/http/auth/public';
import { Roles } from '@root/infra/http/auth/roles';

import { CreateAdDTO } from './dto/create-ad.dto';
import { QueryDataDTO } from './dto/query-data.dto';
import { UpdateAdDTO } from './dto/update-ad.dto';
import { CreateAdSwaggerDoc } from './swagger-responses-dtos/create/create-ad-swagger';
import { DeleteAdSwaggerDoc } from './swagger-responses-dtos/delete/delete-ad-swagger';
import { FindAllAdsByUserIdSwaggerDoc } from './swagger-responses-dtos/find-all/find-all-ads-by-user-id-swagger';
import { FindAllAdsSwaggerDoc } from './swagger-responses-dtos/find-all/find-all-ads-swagger';
import { FindAdByIdSwaggerDoc } from './swagger-responses-dtos/find-by-id/find-ad-by-id-swagger';
import { UpdateAdSwaggerDoc } from './swagger-responses-dtos/update/update-ad-swagger';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class AdvertisementController {
  constructor(
    private readonly createAdUseCase: CreateAdUseCase,
    private readonly deleteAdUseCase: DeleteAdUseCase,
    private readonly findAdByIdUseCase: FindAdByIdUseCase,
    private readonly findAllAdsUseCase: FindAllAdsUseCase,
    private readonly findAllAdsByUserIdUseCase: FindAllAdsByUserIdUseCase,
    private readonly updateAdUseCase: UpdateAdUseCase,
  ) {}

  @CreateAdSwaggerDoc()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Post()
  async create(
    {
      imagesIds,
      brandId,
      capacity,
      color,
      description,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      phone,
      price,
      thumbnailUrl,
      title,
      userId,
      year,
      details,
    }: CreateAdDTO,
    @CurrentUser() payload: UserPayload,
  ) {
    const advertisement = await this.createAdUseCase.execute({
      imagesIds: imagesIds.map((id) => new UniqueEntityId(id)),
      brandId: new UniqueEntityId(brandId),
      capacity: Capacity[capacity],
      color: Color[color],
      description,
      doors: Doors[doors],
      fuel: Fuel[fuel],
      gearBox: GearBox[gearBox],
      km,
      localization,
      model: Model[model],
      phone,
      price,
      thumbnailUrl,
      title,
      userId: new UniqueEntityId(userId ?? payload.sub),
      year,
      details,
    });

    if (advertisement.isLeft()) {
      const error = advertisement.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'Advertisement created successfully',
      response: {
        id: advertisement.value.id,
        brandId: advertisement.value.brandId,
        capacity: advertisement.value.capacity,
        color: advertisement.value.color,
        description: advertisement.value.description,
        doors: advertisement.value.doors,
        fuel: advertisement.value.fuel,
        gearBox: advertisement.value.gearBox,
        km: advertisement.value.km,
        localization: advertisement.value.localization,
        model: advertisement.value.model,
        phone: advertisement.value.phone,
        price: advertisement.value.price,
        thumbnailUrl: advertisement.value.thumbnailUrl,
        title: advertisement.value.title,
        userId: advertisement.value.userId,
        year: advertisement.value.year,
        details: advertisement.value.details,
        soldStatus: advertisement.value.soldStatus,
      },
    };
  }

  @FindAdByIdSwaggerDoc()
  @Public()
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const advertisement = await this.findAdByIdUseCase.execute({
      id: new UniqueEntityId(id),
    });

    if (advertisement.isLeft()) {
      const error = advertisement.value;

      switch (error.message) {
        case 'Advertisement not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Advertisement not found',
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
      message: 'Advertisement found successfully',
      response: advertisement.value,
    };
  }

  @FindAllAdsByUserIdSwaggerDoc()
  @Public()
  @Get('all/:userId')
  async findAllByUserId(@Query('page') page: string, @Param('userId') userId: string) {
    const ads = await this.findAllAdsByUserIdUseCase.execute({
      limit: 30,
      page: Number(page) - 1,
      userId: new UniqueEntityId(userId),
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      response: ads.value,
      statusCode: 200,
      message: 'Ads successfully found',
    };
  }

  @FindAllAdsSwaggerDoc()
  @Public()
  @Get('/all')
  async findAll(@Query('page') pageIndex: string, @Query() data: QueryDataDTO) {
    const ads = await this.findAllAdsUseCase.execute({
      limit: 30,
      page: Number(pageIndex) - 1,
      search: data,
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      response: ads.value,
      statusCode: 200,
      message: 'Ads successfully found',
    };
  }

  @UpdateAdSwaggerDoc()
  @Patch('/update')
  async update(
    {
      id,
      brandId,
      capacity,
      color,
      description,
      details,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      phone,
      price,
      salePrice,
      thumbnailUrl,
      title,
      soldStatus,
      year,
    }: UpdateAdDTO,
    @CurrentUser() payload: UserPayload,
  ) {
    const adUpdated = await this.updateAdUseCase.execute({
      id: new UniqueEntityId(id),
      brandId: new UniqueEntityId(brandId),
      capacity: capacity && Capacity[capacity],
      color: color && Color[color],
      description,
      doors: doors && Doors[doors],
      fuel: fuel && Fuel[fuel],
      gearBox: gearBox && GearBox[gearBox],
      km,
      localization,
      model: model && Model[model],
      phone,
      price,
      thumbnailUrl,
      title,
      userId: new UniqueEntityId(payload.sub),
      year,
      details,
      salePrice,
      soldStatus: soldStatus && SoldStatus[soldStatus],
    });

    if (adUpdated.isLeft()) {
      const error = adUpdated.value;

      switch (error.message) {
        case 'Ad not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'You do not have permission to update this ad':
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
      message: 'Ad successfully updated',
      status: 200,
    };
  }

  @DeleteAdSwaggerDoc()
  @Delete('/:id')
  async delete(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const ad = await this.deleteAdUseCase.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(payload.sub),
    });

    if (ad.isLeft()) {
      const error = ad.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'Advertisement not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'You do not have permission to delete this ad':
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
      message: 'Ad successfully deleted',
    };
  }
}
