import { UpdateUser200DTO } from './update-user-200.dto';
import { UpdateUser400DTO } from './update-user-400.dto';
import { UpdateUser404DTO } from './update-user-404.dto';

export const UpdateUserResponseSwagger = {
  200: UpdateUser200DTO,
  400: UpdateUser400DTO,
  404: UpdateUser404DTO,
};
