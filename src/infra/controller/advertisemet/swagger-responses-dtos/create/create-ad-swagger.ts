import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';

import { CreateAdDTO } from '../../dto/create-ad.dto';

import { CreateAdResponseSwagger } from '.';

export function CreateAdSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiBody({ description: 'Body a ser passado para a requisição', type: CreateAdDTO })(target, key, descriptor);
    ApiOkResponse({
      description: 'Advertisement created successfully',
      status: 200,
      type: CreateAdResponseSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API Error',
      type: CreateAdResponseSwagger[400],
    })(target, key, descriptor);
  };
}
