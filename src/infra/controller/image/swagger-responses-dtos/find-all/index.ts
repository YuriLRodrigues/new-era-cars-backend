import { FindAll200DTO } from './find-all-200.dto';
import { FindAll400DTO } from './find-all-400.dto';
import { FindAll401DTO } from './find-all-401.dto';

export const FindAllResponsesSwagger = {
  200: FindAll200DTO,
  400: FindAll400DTO,
  401: FindAll401DTO,
};
