import { Create201DTO } from './create-200.dto';
import { Create400DTO } from './create-400.dto';
import { Create401DTO } from './create-401.dto';
import { Create404DTO } from './create-404.dto';
import { Create409DTO } from './create-409.dto';

export const CreateBrandResponseSwagger = {
  201: Create201DTO,
  400: Create400DTO,
  401: Create401DTO,
  404: Create404DTO,
  409: Create409DTO,
};
