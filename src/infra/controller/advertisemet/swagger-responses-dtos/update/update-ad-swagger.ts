import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdateAdDTO } from '../../dto/update-ad.dto';

import { UpdateAdResponseSwagger } from '.';

export function UpdateAdSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiOkResponse({
      description: 'Ad successfully updated',
      status: 200,
      type: UpdateAdResponseSwagger[200],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Internal API Error',
      status: 400,
      type: UpdateAdResponseSwagger[400],
    })(target, key, descriptor);
    ApiNotFoundResponse({
      description: 'Ad not found',
      status: 404,
      type: UpdateAdResponseSwagger[404],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      description: 'You do not have permission to update this ad',
      status: 403,
      type: UpdateAdResponseSwagger[403],
    })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiBody({ description: 'Body a ser passado para a requisição', type: UpdateAdDTO })(target, key, descriptor);
  };
}
