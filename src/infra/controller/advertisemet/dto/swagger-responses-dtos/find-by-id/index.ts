import { FindById200DTO } from './find-by-id-200.dto';
import { FindById400DTO } from './find-by-id-400.dto';
import { FindById404DTO } from './find-by-id-404.dto';

export const FindAdByIdResponseSwagger = {
  200: FindById200DTO,
  400: FindById400DTO,
  404: FindById404DTO,
};
