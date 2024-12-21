import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { CreateLikeAdResponsesSwagger } from '.';

export function CreateLikeAdSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiCreatedResponse({
      status: 201,
      description: 'Like created successfully in advertisement',
      type: CreateLikeAdResponsesSwagger[201],
    })(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Internal API error', type: CreateLikeAdResponsesSwagger[400] })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({
      status: 404,
      description: 'Advertisement not found',
      type: CreateLikeAdResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
