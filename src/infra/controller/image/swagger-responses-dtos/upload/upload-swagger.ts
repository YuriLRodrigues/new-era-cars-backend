import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FileUploadDTO } from '../../dto/upload.dto';

import { UploadResponsesSwagger } from '.';

export function UploadSwaggerDoc() {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiCreatedResponse({
      status: 201,
      description: 'Image uploaded successfully',
      type: UploadResponsesSwagger[201],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Internal API Error',
      type: UploadResponsesSwagger[400],
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: 'Invalid image type',
      type: UploadResponsesSwagger[400],
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      status: 401,
      description: 'You do not have permission to upload an image',
      type: UploadResponsesSwagger[401],
    })(target, key, descriptor);
    ApiBody({ description: 'Body a ser passado para a requisição', type: FileUploadDTO })(target, key, descriptor);
  };
}
