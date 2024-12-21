import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { CreateLikeFbResponsesSwagger } from '.';

export function CreateLikeFbSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiCreatedResponse({
      status: 201,
      description: 'Like created successfully in feedback',
      type: CreateLikeFbResponsesSwagger[201],
    })(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Internal API error', type: CreateLikeFbResponsesSwagger[400] })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({
      status: 404,
      description: 'Feedback not found',
      type: CreateLikeFbResponsesSwagger[404],
    })(target, key, descriptor);
  };
}
