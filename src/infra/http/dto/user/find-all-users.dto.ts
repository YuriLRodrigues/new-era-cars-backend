import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { ApiPaginatedResponse, PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerNotAllowedDto } from '../swagger.dto';
import { UserDto } from './user.dto';

export class FindAllUsers extends UserDto {}

export const SwaggerFindAllUsersDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllUsers' })(target, key, descriptor);
    ApiQuery({
      type: PaginationDto,
    })(target, key, descriptor);
    ApiPaginatedResponse(FindAllUsers)(target, key, descriptor);
    ApiForbiddenResponse({ status: 403, description: 'Not allowed', type: SwaggerNotAllowedDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
