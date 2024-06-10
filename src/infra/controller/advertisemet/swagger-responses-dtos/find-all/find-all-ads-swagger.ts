import { ApiBadRequestResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { FindAllResponsesSwagger } from '@root/infra/controller/user/swagger-responses-dtos/find-all';

import { QueryDataDTO } from '../../dto/query-data.dto';

export function FindAllAdsSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiOkResponse({
      status: 200,
      type: FindAllResponsesSwagger[200],
      description: 'Ads successfully found',
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Internal API Error',
      status: 400,
      type: FindAllResponsesSwagger[400],
    })(target, key, descriptor);
    ApiQuery({ name: 'Search Queries', type: QueryDataDTO })(target, key, descriptor);
  };
}
