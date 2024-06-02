import { DeleteUser200DTO } from './delete-user-200.dto';
import { DeleteUser400DTO } from './delete-user-400.dto';
import { DeleteUser401DTO } from './delete-user-401.dto';
import { DeleteUser404DTO } from './delete-user-404.dto';

export const DeleteUserResponseSwagger = {
  200: DeleteUser200DTO,
  400: DeleteUser400DTO,
  401: DeleteUser401DTO,
  404: DeleteUser404DTO,
};
