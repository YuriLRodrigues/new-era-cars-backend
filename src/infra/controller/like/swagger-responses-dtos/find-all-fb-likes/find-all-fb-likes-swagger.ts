import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllFbLikesResponsesSwagger } from '.';

export function FindAllFbLikesSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Like count by feedback was found successfully',
      type: FindAllFbLikesResponsesSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: FindAllFbLikesResponsesSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Feedback not found',
      type: FindAllFbLikesResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
