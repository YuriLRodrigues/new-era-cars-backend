import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAdvertisementsMetricsResponseDto {
  @ApiProperty({ example: 100, description: 'The number of active advertisements' })
  @IsNumber()
  @IsNotEmpty()
  activeAdvertisements: number;

  @ApiProperty({ example: 25, description: 'The number of reserved advertisements' })
  @IsNumber()
  @IsNotEmpty()
  reservedAdvertisements: number;

  @ApiProperty({ example: 50, description: 'The number of sold advertisements' })
  @IsNumber()
  @IsNotEmpty()
  soldAdvertisements: number;

  @ApiProperty({ example: 75, description: 'The total number of sellers' })
  @IsNumber()
  @IsNotEmpty()
  totalSellers: number;
}

export const SwaggerFindAdvertisementsMetricsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAdvertisementsMetrics' })(target, key, descriptor);
    ApiPaginatedResponse(FindAdvertisementsMetricsResponseDto)(target, key, descriptor);
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
    ApiBadRequestResponse({ status: 403, description: 'Not Allowed', type: SwaggerNotAllowedDto })(
      target,
      key,
      descriptor,
    );
  };
};
