import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateBrandResponseSwagger } from '.';

export function CreateBrandSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiCreatedResponse({
      status: 201,
      description: 'Brand successfully created',
      type: CreateBrandResponseSwagger[201],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'User not found',
      type: CreateBrandResponseSwagger[404],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You are not allowed to create a brand',
      type: CreateBrandResponseSwagger[401],
    })(target, key, descriptor);
    ApiConflictResponse({
      status: 409,
      description: 'Brand already exists',
      type: CreateBrandResponseSwagger[409],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: CreateBrandResponseSwagger[400],
    })(target, key, descriptor);
  };
}
