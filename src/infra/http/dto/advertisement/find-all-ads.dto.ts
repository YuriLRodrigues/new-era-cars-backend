import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ApiPaginatedResponse, PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto } from '../swagger.dto';
import { MinimalAdvertisementDetailsDto } from './entity-dtos/minimal-advertisement-details.dto';
import { QuerySearchDto } from './query-search.dto';

export class FindAllAdsQueryDto extends QuerySearchDto {
  @ApiPropertyOptional({
    type: String,
    example: '1',
    default: 1,
    description: 'Page number to send to API',
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    type: String,
    example: '9',
    default: 9,
    description: 'Limit of data to be returned from the API',
  })
  @IsOptional()
  limit?: number = 9;
}

export const SwaggerFindAllAdsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllAdvertisements' })(target, key, descriptor);
    // ApiParam({
    //   name: 'userId',
    //   example: '/123',
    //   description: 'Id of user to be found',
    // })(target, key, descriptor);
    ApiQuery({
      type: PaginationDto,
    })(target, key, descriptor);
    ApiPaginatedResponse(MinimalAdvertisementDetailsDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
