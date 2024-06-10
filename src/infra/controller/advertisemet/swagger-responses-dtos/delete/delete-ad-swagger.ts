import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeleteAdResponseSwagger } from '.';

export function DeleteAdSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiOkResponse({
      status: 200,
      type: DeleteAdResponseSwagger[200],
      description: 'Ad successfully deleted',
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Internal API Error',
      status: 400,
      type: DeleteAdResponseSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      description: 'User not found',
      status: 404,
      type: DeleteAdResponseSwagger[404],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      description: 'Advertisement not found',
      status: 404,
      type: DeleteAdResponseSwagger[404],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      description: 'You do not have permission to delete this ad',
      status: 401,
      type: DeleteAdResponseSwagger[401],
    })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiParam({ name: 'id', example: '946d59bf-fc0b-43c0-bc4e-a86808c1bd7d' })(target, key, descriptor);
  };
}
