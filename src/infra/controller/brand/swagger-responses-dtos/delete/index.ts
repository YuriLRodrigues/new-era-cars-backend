import { Delete200DTO } from './delete-200.dto';
import { Delete400DTO } from './delete-400.dto';
import { Delete401DTO } from './delete-401.dto';
import { Delete404DTO } from './delete-404.dto';

export const DeleteBrandResponseSwagger = {
  200: Delete200DTO,
  400: Delete400DTO,
  401: Delete401DTO,
  404: Delete404DTO,
};
