import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllAdLikesResponsesSwagger } from '.';

export function FindAllAdLikesSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Like count by advertisement was found successfully',
      type: FindAllAdLikesResponsesSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: FindAllAdLikesResponsesSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Advertisement not found',
      type: FindAllAdLikesResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
