import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeleteResponsesSwagger } from '.';

export function DeleteSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiParam({ name: 'Image Id', example: '54d5c1e3-aadd-4b2d-99a2-196fcb98429f' })(target, key, descriptor);
    ApiOkResponse({ status: 200, description: 'Image deleted successfully', type: DeleteResponsesSwagger[200] })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Internal API error', type: DeleteResponsesSwagger[400] })(
      target,
      key,
      descriptor,
    );
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You do not have permission to delete this image',
      type: DeleteResponsesSwagger[401],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Image not found',
      type: DeleteResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
