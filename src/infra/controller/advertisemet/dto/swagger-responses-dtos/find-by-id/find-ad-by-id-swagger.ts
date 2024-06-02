import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';

import { FindAdByIdResponseSwagger } from '.';

export function FindAdByIdSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiOkResponse({
      description: 'Advertisement found successfully',
      status: 200,
      type: FindAdByIdResponseSwagger[200],
    })(target, key, descriptor);
    ApiParam({
      name: 'Advertisement id',
      description: 'The id of the ad to be searched',
      example: '3e36d499-df78-48f2-a4ef-919732171bec',
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Internal API Error',
      status: 400,
      type: FindAdByIdResponseSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      description: 'Advertisement not found',
      status: 404,
      type: FindAdByIdResponseSwagger[404],
    })(target, key, descriptor);
  };
}
