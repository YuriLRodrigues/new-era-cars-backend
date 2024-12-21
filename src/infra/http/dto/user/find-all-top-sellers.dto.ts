import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class FindAllTopSellersBodyDto {
  @ApiProperty({
    example: '6f3a7fb7-60e5-4ae9-9e1e-6d0d3ccbd979',
    description: 'The unique user ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The URL for the user avatar',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  avatar: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  name: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  username: string;

  @ApiProperty({
    example: 'Customer',
    description: "The user's role",
    type: String,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'The role must be a valid UserRole' })
  role: UserRole;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was disabled',
    type: Date,
  })
  @IsOptional()
  @IsDate({ message: 'The disabled field must be a valid date' })
  disabled?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
    type: Date,
  })
  @IsDate({ message: 'The createdAt field must be a valid date' })
  @IsNotEmpty({ message: 'The createdAt field is required' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was last updated',
    type: Date,
  })
  @IsOptional()
  @IsDate({ message: 'The updatedAt field must be a valid date' })
  updatedAt?: Date;
}

class FindAllTopSellersResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'User created successfully',
  })
  message: string;
}

export const SwaggerFindAllTopSellersDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllTopSellers' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiQuery({
      type: PaginationDto,
    })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'User successfully updated', type: FindAllTopSellersResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
