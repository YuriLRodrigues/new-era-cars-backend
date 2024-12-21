import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class UpdateOwnUserBodyDto {
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
}

class UpdateOwnUserResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'User successfully updated',
  })
  message: string;
}

export const SwaggerUpdateOwnUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateOwnUser' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiBody({
      type: UpdateOwnUserBodyDto,
      description: 'Body to update user',
    })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'User successfully updated', type: UpdateOwnUserResponseDto })(
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
