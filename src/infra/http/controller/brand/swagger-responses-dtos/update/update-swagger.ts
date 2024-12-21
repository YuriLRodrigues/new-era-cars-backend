import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdateBrandResponseSwagger } from '.';

export function UpdateBrandSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Brand successfully updated',
      type: UpdateBrandResponseSwagger[200],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Brand not found',
      type: UpdateBrandResponseSwagger[404],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You are not allowed to update this brand',
      type: UpdateBrandResponseSwagger[401],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: UpdateBrandResponseSwagger[400],
    })(target, key, descriptor);
  };
}
