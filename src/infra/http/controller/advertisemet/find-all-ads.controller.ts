import { BadRequestException, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-ads.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { FindAllAdsQueryDto, SwaggerFindAllAdsDto } from '../../dto/advertisement/find-all-ads.dto';
import { MinimalAdvertisementDetailsViewModel } from '../../view-model/advertisement/minimal-advertisement-details.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllAdvertisementsController {
  constructor(private readonly findAllAdsUseCase: FindAllAdsUseCase) {}

  @SwaggerFindAllAdsDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager, UserRoles.Customer], isAll: false })
  @Get('/all')
  async handle(@Query() query: FindAllAdsQueryDto) {
    const { page, limit, brand, color, date, fuel, km, likes, model, price, year } = query;

    const ads = await this.findAllAdsUseCase.execute({
      limit,
      page,
      search: {
        brand,
        color,
        date,
        fuel,
        km,
        likes,
        model,
        price,
        year,
      },
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
      results: ads.value.data.map((ad) => MinimalAdvertisementDetailsViewModel.toHttp(ad)),
      meta: ads.value.meta,
    };
  }
}
