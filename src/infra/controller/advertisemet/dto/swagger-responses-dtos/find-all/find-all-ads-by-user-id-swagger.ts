import { ApiBadRequestResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FindAllResponsesSwagger } from '@root/infra/controller/user/swagger-responses-dtos/find-all';

export function FindAllAdsByUserIdSwaggerDoc() {
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
    ApiQuery({
      description: 'This query is responsible for paginating the items in a given ad',
      example: 'url/:id?page=1',
    })(target, key, descriptor);
    ApiParam({
      name: 'userId',
      description: 'The user id to be searched for in your ads',
      example: '3e36d499-df78-48f2-a4ef-919732171bec',
    })(target, key, descriptor);
  };
}
