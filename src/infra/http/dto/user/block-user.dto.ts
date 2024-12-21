import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class BlockUserResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Seller successfully blocked',
  })
  message: string;
}

export const SwaggerBlockUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'blockUser' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    // ApiParam({
    //   name: 'Seller to block',
    //   example: '/block/1',
    //   description: 'Id of seller to be blocked',
    // })(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Seller successfully blocked',
      type: BlockUserResponseDto,
    })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
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
