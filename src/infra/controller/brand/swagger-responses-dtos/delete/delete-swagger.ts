import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeleteBrandResponseSwagger } from '.';

export function DeleteBrandSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Brand successfully deleted',
      type: DeleteBrandResponseSwagger[200],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Brand not found',
      type: DeleteBrandResponseSwagger[404],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You are not allowed to delete this brand',
      type: DeleteBrandResponseSwagger[401],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: DeleteBrandResponseSwagger[400],
    })(target, key, descriptor);
  };
}
