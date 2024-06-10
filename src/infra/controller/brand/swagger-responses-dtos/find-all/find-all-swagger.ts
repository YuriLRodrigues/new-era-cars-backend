import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllBrandsResponseSwagger } from '.';

export function FindAllBrandsSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiOkResponse({
      status: 200,
      description: 'Brands successfully found',
      type: FindAllBrandsResponseSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API error',
      type: FindAllBrandsResponseSwagger[400],
    })(target, key, descriptor);
  };
}
