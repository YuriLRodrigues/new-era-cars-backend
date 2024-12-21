import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPaginatedResponse, PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { MinimalAdvertisementDetailsDto } from './entity-dtos/minimal-advertisement-details.dto';

export class UpdateAdDTO {
  @ApiProperty({ example: 10000, description: 'The vehicle’s mileage' })
  @IsNumber()
  @IsOptional()
  km?: number;

  @ApiProperty({ example: 'City - State', description: 'The location of the advertisement' })
  @IsString()
  @IsOptional()
  localization?: string;

  @ApiProperty({ example: '(31) 93333-4444', description: 'The contact phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Honda Civic', description: 'The title of the advertisement' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'url-test',
    description: 'The thumbnail URL',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'A semi-new car, never crashed...', description: 'The advertisement description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2024, description: 'The vehicle’s year' })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: ['feature1', 'feature2'], description: 'Additional optional details about the vehicle' })
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'The unique identifier of the vehicle’s brand',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({ enum: Doors, description: 'Number of doors of the vehicle' })
  @IsEnum(Doors)
  @IsOptional()
  doors?: Doors;

  @ApiProperty({ enum: Model, description: 'The model/type of the vehicle' })
  @IsEnum(Model)
  @IsOptional()
  model?: Model;

  @ApiProperty({ enum: Color, description: 'The color of the vehicle' })
  @IsEnum(Color)
  @IsOptional()
  color?: Color;

  @ApiProperty({ example: 25000, description: 'The price of the vehicle' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ enum: SoldStatus, description: 'Flag indicating if the vehicle has been sold' })
  @IsEnum(SoldStatus)
  @IsOptional()
  soldStatus?: SoldStatus;

  @ApiProperty({ example: 22000, description: 'The sale price of the vehicle if it was sold' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ enum: GearBox, description: 'The type of gear transmission in the vehicle' })
  @IsEnum(GearBox)
  @IsOptional()
  gearBox?: GearBox;

  @ApiProperty({ enum: Fuel, description: 'The type of fuel the vehicle uses' })
  @IsEnum(Fuel)
  @IsOptional()
  fuel?: Fuel;

  @ApiProperty({ enum: Capacity, description: 'The seating capacity of the vehicle' })
  @IsEnum(Capacity)
  @IsOptional()
  capacity?: Capacity;
}

export const SwaggerUpdateAdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'updateAdvertisement' })(target, key, descriptor);
    ApiPaginatedResponse(MinimalAdvertisementDetailsDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 404, description: 'Resource Not Found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
    // ApiParam({
    //   name: 'id',
    //   example: '/1',
    //   description: 'Id of advertisement to be found',
    // });
    ApiQuery({
      name: 'userId',
      example: '/123',
      description: 'Id of user to be found',
    });
    ApiQuery({
      type: PaginationDto,
    });
    ApiQuery({
      name: 'id',
      type: String,
      isArray: true,
      description: 'The IDs of the advertisements to be updated',
    })(target, key, descriptor);
    ApiQuery({
      name: 'km',
      type: Number,
      description: 'The vehicle’s mileage',
    })(target, key, descriptor);
    ApiQuery({
      name: 'localization',
      type: String,
      description: 'The location of the advertisement',
    })(target, key, descriptor);
    ApiQuery({
      name: 'phone',
      type: String,
      description: 'The contact phone number',
    })(target, key, descriptor);
    ApiQuery({
      name: 'title',
      type: String,
      description: 'The title of the advertisement',
    })(target, key, descriptor);
    ApiQuery({
      name: 'thumbnailUrl',
      type: String,
      description: 'The thumbnail URL',
    })(target, key, descriptor);
    ApiQuery({
      name: 'description',
      type: String,
      description: 'The advertisement description',
    })(target, key, descriptor);
    ApiQuery({
      name: 'year',
      type: Number,
      description: 'The vehicle’s year',
    })(target, key, descriptor);
    ApiQuery({
      name: 'details',
      type: String,
      isArray: true,
      description: 'Additional optional details about the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'brandId',
      type: String,
      description: 'The unique identifier of the vehicle’s brand',
    })(target, key, descriptor);
    ApiQuery({
      name: 'doors',
      type: String,
      enum: Doors,
      description: 'Number of doors of the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'model',
      type: String,
      enum: Model,
      description: 'The model/type of the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'color',
      type: String,
      enum: Color,
      description: 'The color of the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'price',
      type: Number,
      description: 'The price of the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'soldStatus',
      type: String,
      enum: SoldStatus,
      description: 'Flag indicating if the vehicle has been sold',
    })(target, key, descriptor);
    ApiQuery({
      name: 'salePrice',
      type: Number,
      description: 'The sale price of the vehicle if it was sold',
    })(target, key, descriptor);
    ApiQuery({
      name: 'gearBox',
      type: String,
      enum: GearBox,
      description: 'The type of gear transmission in the vehicle',
    })(target, key, descriptor);
    ApiQuery({
      name: 'fuel',
      type: String,
      enum: Fuel,
      description: 'The type of fuel the vehicle uses',
    })(target, key, descriptor);
    ApiQuery({
      name: 'capacity',
      type: String,
      enum: Capacity,
      description: 'The seating capacity of the vehicle',
    })(target, key, descriptor);
  };
};
