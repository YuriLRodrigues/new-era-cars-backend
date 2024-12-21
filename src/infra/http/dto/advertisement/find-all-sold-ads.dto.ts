import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { MinimalAdvertisementDetailsDto } from './entity-dtos/minimal-advertisement-details.dto';

export class FindAllSoldAdsQueryDto {
  @ApiPropertyOptional({
    type: String,
    example: '9',
    default: 1,
    description: 'Limit of data to be returned from the API',
  })
  @IsOptional()
  referenceDate?: number = 1;
}

export const SwaggerFindAllSoldAdsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllSoldAds' })(target, key, descriptor);
    ApiPaginatedResponse(MinimalAdvertisementDetailsDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 404, description: 'Resource Not Found', type: SwaggerResourceNotFoundDto })(
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
