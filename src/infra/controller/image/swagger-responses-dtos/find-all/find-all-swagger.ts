import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FindAllResponsesSwagger } from '.';

export function FindAllSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ status: 200, description: 'Images found', type: FindAllResponsesSwagger[200] })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Internal API error', type: FindAllResponsesSwagger[400] })(
      target,
      key,
      descriptor,
    );
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You do not have permission to find all images',
      type: FindAllResponsesSwagger[401],
    })(target, key, descriptor);
    ApiQuery({ name: 'Página atual', example: '2' })(target, key, descriptor);
  };
}
