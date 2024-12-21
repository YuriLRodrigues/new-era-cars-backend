import { BadRequestException, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllTopSellersUseCase } from '@root/domain/application/use-cases/user/find-all-top-sellers.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { PaginationDto } from '../../dto/pagination.dto';
import { SwaggerFindAllTopSellersDto } from '../../dto/user/find-all-top-sellers.dto';

@Controller('/user')
@ApiTags('User - Controller')
export class FindAllTopSellersController {
  constructor(private readonly findAllTopSellers: FindAllTopSellersUseCase) {}

  @SwaggerFindAllTopSellersDto()
  @Roles({ roles: [UserRoles.Seller] })
  @Get('/top-sellers')
  async findAll(@Query() query: PaginationDto) {
    const { page, limit } = query;

    const ads = await this.findAllTopSellers.execute({
      limit,
      page,
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
      results: ads.value,
    };
  }
}
