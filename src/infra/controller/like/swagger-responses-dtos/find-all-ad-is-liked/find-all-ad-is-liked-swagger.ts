import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllAdIsLikedResponsesSwagger } from '.';

export function FindAllAdIsLikedSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Validation if the user has already liked found',
      type: FindAllAdIsLikedResponsesSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: FindAllAdIsLikedResponsesSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Feedback not found',
      type: FindAllAdIsLikedResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
