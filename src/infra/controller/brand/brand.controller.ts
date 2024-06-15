import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { CreateBrandUseCase } from '@root/domain/application/use-cases/brand/create-brand.use-case';
import { DeleteBrandUseCase } from '@root/domain/application/use-cases/brand/delete-brand.use-case';
import { FindAllBrandsUseCase } from '@root/domain/application/use-cases/brand/find-all-brands.use-case';
import { UpdateBrandUseCase } from '@root/domain/application/use-cases/brand/update-brand.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/http/auth/auth-user';
import { CurrentUser } from '@root/infra/http/auth/current-user';
import { Public } from '@root/infra/http/auth/public';
import { Roles } from '@root/infra/http/auth/roles';

import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { CreateBrandSwaggerDoc } from './swagger-responses-dtos/create/create-swagger';
import { DeleteBrandSwaggerDoc } from './swagger-responses-dtos/delete/delete-swagger';
import { FindAllBrandsSwaggerDoc } from './swagger-responses-dtos/find-all/find-all-swagger';
import { UpdateBrandSwaggerDoc } from './swagger-responses-dtos/update/update-swagger';

@Controller('/brand')
@ApiTags('Brand - Controller')
export class BrandController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
    private readonly findAllBrandsUseCase: FindAllBrandsUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
  ) {}

  @CreateBrandSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager] })
  @Post()
  async create({ logoUrl, name }: CreateBrandDTO, @CurrentUser() { sub }: UserPayload) {
    const brand = await this.createBrandUseCase.execute({
      logoUrl,
      name,
      userId: new UniqueEntityId(sub),
    });

    if (brand.isLeft()) {
      const error = brand.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'You are not allowed to create a brand':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case 'Brand already exists':
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
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
      response: brand.value,
      statusCode: 201,
      message: 'Brand successfully created',
    };
  }

  @FindAllBrandsSwaggerDoc()
  @Public()
  @Get()
  async findAll() {
    const brands = await this.findAllBrandsUseCase.execute();

    if (brands.isLeft()) {
      const error = brands.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      response: brands.value,
      statusCode: 200,
      message: 'Brands successfully found',
    };
  }

  @UpdateBrandSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager] })
  @Patch('/:id')
  async update({ logoUrl, name }: UpdateBrandDTO, @Param('id') brandId: string, @CurrentUser() { sub }: UserPayload) {
    const brand = await this.updateBrandUseCase.execute({
      id: new UniqueEntityId(brandId),
      userId: new UniqueEntityId(sub),
      logoUrl,
      name,
    });

    if (brand.isLeft()) {
      const error = brand.value;

      switch (error.message) {
        case 'You do not have permission to update this brand':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case 'Brand not found':
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
      message: 'Brand successfully updated',
    };
  }

  @DeleteBrandSwaggerDoc()
  @Roles({ roles: [UserRoles.Manager] })
  @Delete('/:id')
  async delete(@Param('id') brandId: string, @CurrentUser() { sub }: UserPayload) {
    const brand = await this.deleteBrandUseCase.execute({
      id: new UniqueEntityId(brandId),
      userId: new UniqueEntityId(sub),
    });

    if (brand.isLeft()) {
      const error = brand.value;

      switch (error.message) {
        case 'You do not have permission to delete this brand':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case 'Brand not found':
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
      message: 'Brand successfully deleted',
    };
  }
}
