import { Signup201DTO } from './signup-200.dto';
import { Signup400DTO } from './signup-400.dto';
import { Signup409DTO } from './signup-409.dto';

export const SignupResponsesSwagger = {
  201: Signup201DTO,
  409: Signup409DTO,
  400: Signup400DTO,
};
