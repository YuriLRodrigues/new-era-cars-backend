import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllFbIsLikedResponsesSwagger } from '.';

export function FindAllFbIsLikedSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      status: 200,
      description: 'Validation if the user has already liked found',
      type: FindAllFbIsLikedResponsesSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: FindAllFbIsLikedResponsesSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      status: 404,
      description: 'Feedback not found',
      type: FindAllFbIsLikedResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
